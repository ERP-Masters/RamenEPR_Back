import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { InventoryEntity } from "../entities/inventory.entity";
import { InventoryStatus, CategoryGroup, OrderStatus } from "@prisma/client";
import { calcExpiryDate } from "../../policy/expiry.policy";

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private loadEntity(inven: any): InventoryEntity {
    return new InventoryEntity(
      inven.id,
      inven.inventory_id,                               // ERP ID
      inven.warehouse?.name || inven.warehouse_id,      // 창고 이름 or ID
      inven.item?.name || inven.item_id,                // 품목 이름 or ID
      inven.lot_id,
      inven.quantity,
      inven.safety_stock,
      inven.store_date,
      inven.expiry_date,
    );
  }

  private async generateInventoryId(tx: any, warehouseId: number, itemId: number): Promise<string> {
    const warehouse = await tx.warehouse.findUnique({
      where: { id: warehouseId },
      select: { warehouse_id: true },
    });

    const item = await tx.item.findUnique({
      where: { id: itemId },
      select: { item_id: true },
    });

    if (!warehouse || !item) throw new Error("warehouse 또는 item 정보를 불러올 수 없습니다.");

    const whCodeRaw = warehouse.warehouse_id.replace(/_/g, "");
    const itemCodeRaw = item.item_id.replace(/_/g, "");

    const whCode = whCodeRaw.replace(/^WH/i, "");
    const itemCode = itemCodeRaw.replace(/^IT/i, "");

    const seq = await tx.inventory.count({
      where: { warehouse_id: warehouseId, item_id: itemId },
    });

    const padded = (seq + 1).toString().padStart(4, "0");
    return `INV_${whCode}_${itemCode}_${padded}`;
  }

  private async generateLotId(tx: any, warehouseId: number, itemId: number): Promise<string> {
    const warehouse = await tx.warehouse.findUnique({
      where: { id: warehouseId },
      select: { warehouse_id: true },
    });

    const item = await tx.item.findUnique({
      where: { id: itemId },
      select: { item_id: true },
    });

    if (!warehouse || !item) throw new Error("warehouse 또는 item 정보를 불러올 수 없습니다.");

    const whRaw = warehouse.warehouse_id.replace(/_/g, "");
    const itemRaw = item.item_id.replace(/_/g, "");

    const whCode = whRaw.replace(/^WH/i, "");
    const itemCode = itemRaw.replace(/^IT/i, "");

    const now = new Date();
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");

    const prefix = `LOT_${whCode}_${itemCode}_${yymmdd}_`;
    const seq = await tx.lotTrace.count({
      where: { lot_id: { startsWith: prefix }},
    });

    const padded = (seq + 1).toString().padStart(4, "0");
    return `${prefix}${padded}`;
  }

  /**
   * 외부에서 직접 호출하는 일반 입고
   */
  async receive(
    warehouseId: number,
    itemId: number,
    quantity: number,
    manufactureDate?: Date,
    expiryDate?: Date,
  ) {
    return this._receiveInternal(warehouseId, itemId, quantity, manufactureDate, expiryDate);
  }

  /**
   * 발주 연계 부분 입고 처리
   */
  async receivePartial(
    orderId: number,
    warehouseId: number,
    itemId: number,
    totalOrderedQty: number,
    alreadyReceivedQty: number,
    newlyReceivedQty: number,
    manufactureDate?: Date,
    expiryDate?: Date,
  ) {
    if (newlyReceivedQty <= 0)
      throw new BadRequestException("입고 수량은 0보다 커야 합니다.");

    const remaining = totalOrderedQty - alreadyReceivedQty;

    if (remaining <= 0) {
      throw new BadRequestException("이미 발주 수량 전체가 입고 처리되었습니다.");
    }
    if (newlyReceivedQty > remaining) {
      throw new BadRequestException(
        `입고 수량이 잔여 발주 수량을 초과합니다. (잔여: ${remaining}, 요청: ${newlyReceivedQty})`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId },
        select: { id: true, item_id: true, category: { select: { group: true } } },
      });

      if (!item) throw new Error(`Item ${itemId} not found`);

      const storeDate = new Date();
      const effExpiry = expiryDate ?? calcExpiryDate(item.category.group as CategoryGroup, storeDate);

      const lotId = await this.generateLotId(tx, warehouseId, itemId);

      // 기존 재고 확인
      const existing = await tx.inventory.findFirst({
        where: { warehouse_id: warehouseId, item_id: itemId, expiry_date: effExpiry },
      });

      let inv;

      if (existing) {
        // ★ 여기 수정됨: safety_stock 자동 100 적용
        inv = await tx.inventory.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity + newlyReceivedQty,
            safety_stock: 100, // ★ FIXED
          },
        });
      } else {
        const inventory_id = await this.generateInventoryId(tx, warehouseId, itemId);
        inv = await tx.inventory.create({
          data: {
            inventory_id,
            warehouse_id: warehouseId,
            item_id: itemId,
            lot_id: lotId,
            quantity: newlyReceivedQty,
            safety_stock: 100,  // NEW ALWAYS SET
            store_date: storeDate,
            expiry_date: effExpiry,
            status: InventoryStatus.NORMAL,
          },
        });
      }

      // LOT 생성
      await tx.lotTrace.create({
        data: {
          lot_id: lotId,
          item_id: itemId,
          warehouse_id: warehouseId,
          inventory_id: inv.id,
          manufacture_date: manufactureDate ?? storeDate,
          expiry_date: effExpiry,
        },
      });

      const totalReceived = alreadyReceivedQty + newlyReceivedQty;
      const newStatus =
        totalReceived >= totalOrderedQty
          ? OrderStatus.COMPLETED
          : OrderStatus.PARTIALLY;

      // 발주 상태 갱신
      await tx.vendorOrder.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          received_quantity: { increment: newlyReceivedQty },
        },
      });

      return {
        ...this.loadEntity(inv),
        receivedQty: newlyReceivedQty,
        totalReceived,
        totalOrderedQty,
        orderStatus: newStatus,
      };
    });
  }

  /**
   * 공통 순수 입고 로직
   */
  private async _receiveInternal(
    warehouseId: number,
    itemId: number,
    quantity: number,
    manufactureDate?: Date,
    expiryDate?: Date,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId },
        select: { id: true, item_id: true, category: { select: { group: true } }},
      });

      if (!item) throw new Error(`Item ${itemId} not found`);

      const storeDate = new Date();
      const effExpiry =
        expiryDate ?? calcExpiryDate(item.category.group as CategoryGroup, storeDate);

      const lotId = await this.generateLotId(tx, warehouseId, itemId);

      const existing = await tx.inventory.findFirst({
        where: { warehouse_id: warehouseId, item_id: itemId, expiry_date: effExpiry },
      });

      let inv;

      if (existing) {
        // ★ 여기도 동일하게 safety_stock 100 적용
        inv = await tx.inventory.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity + quantity,
            safety_stock: 100, // ★ FIXED
          },
        });
      } else {
        const inventory_id = await this.generateInventoryId(tx, warehouseId, itemId);
        inv = await tx.inventory.create({
          data: {
            inventory_id,
            warehouse_id: warehouseId,
            item_id: itemId,
            lot_id: lotId,
            quantity,
            safety_stock: 100, // ALWAYS SET
            store_date: storeDate,
            expiry_date: effExpiry,
            status: InventoryStatus.NORMAL,
          },
        });
      }

      await tx.lotTrace.create({
        data: {
          lot_id: lotId,
          item_id: itemId,
          warehouse_id: warehouseId,
          inventory_id: inv.id,
          manufacture_date: manufactureDate ?? storeDate,
          expiry_date: effExpiry,
        },
      });

      return this.loadEntity(inv);
    });
  }

  async findByWarehouse(warehouseId: number) {
    const inv = await this.prisma.inventory.findMany({
      where: { warehouse_id: warehouseId, quantity: { gt: 0 }},
      include: {
        warehouse: { select: { name: true }},
        item: { select: { name: true }},
      },
    });
    return inv.map((v) => this.loadEntity(v));
  }

  async findByWarehouseName(warehouseName: string) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { name: warehouseName },
    });

    if (!warehouse) throw new Error(`Warehouse not found: ${warehouseName}`);

    const inv = await this.prisma.inventory.findMany({
      where: { warehouse_id: warehouse.id, quantity: { gt: 0 }},
      include: {
        warehouse: { select: { name: true }},
        item: { select: { name: true }},
      },
    });

    return inv.map((v) => this.loadEntity(v));
  }

  async findLotsByItem(itemId: number) {
    const lots = await this.prisma.lotTrace.findMany({
      where: { item_id: itemId },
      orderBy: { received_date: "desc" },
      include: {
        item: { select: { name: true }},
        warehouse: { select: { name: true }},
      },
    });

    return lots.map((lot) => ({
      id: lot.id,
      lot_id: lot.lot_id,
      item_name: lot.item?.name ?? "알 수 없음",
      warehouse_name: lot.warehouse?.name ?? "알 수 없음",
      manufacture_date: lot.manufacture_date,
      expiry_date: lot.expiry_date,
      received_date: lot.received_date,
    }));
  }

  async findAll(status?: string) {
    const where: any = { quantity: { gt: 0 }};

    if (status) where.status = status as InventoryStatus;

    const inv = await this.prisma.inventory.findMany({
      where,
      include: {
        warehouse: { select: { name: true }},
        item: { select: { name: true }},
      },
    });

    return inv.map((v) => this.loadEntity(v));
  }
}
