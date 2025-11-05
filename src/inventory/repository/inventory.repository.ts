import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { InventoryEntity } from "../entities/inventory.entity";
import { InventoryStatus, CategoryGroup, OrderStatus } from "@prisma/client";
import { calcExpiryDate } from "../../policy/expiry.policy";

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  private loadEntity(inven: any): InventoryEntity {
    return new InventoryEntity(
      inven.id,
      inven.inventory_id,
      inven.warehouse_id,
      inven.item_id,
      inven.lot_id,
      inven.quantity,
      inven.safety_stock,
      inven.store_date,
      inven.expiry_date,
    );
  }

  private async generateInventoryId(tx: any): Promise<string> {
    const count = await tx.inventory.count();
    return `INV_${(count + 1).toString().padStart(4, "0")}`;
  }

  private async generateLotId(tx: any, itemCode: string): Promise<string> {
    const now = new Date();
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
    const prefix = `LOT_${itemCode}_${yymmdd}_`;
    const seq = await tx.lotTrace.count({
      where: { lot_id: { startsWith: prefix } },
    });
    return `${prefix}${(seq + 1).toString().padStart(4, "0")}`;
  }

  /**
   * 전체 입고 처리
   */
  async receive(
    warehouseId: number,
    itemId: number,
    quantity: number,
    manufactureDate?: Date,
    expiryDate?: Date,
  ) {
    return this._receiveInternal(
      warehouseId,
      itemId,
      quantity,
      manufactureDate,
      expiryDate,
      false,
    );
  }

  /**
   * 부분 입고 처리
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
    console.log("🟡 [receivePartial] 호출됨:", {
      orderId,
      warehouseId,
      itemId,
      totalOrderedQty,
      alreadyReceivedQty,
      newlyReceivedQty,
    });

    if (newlyReceivedQty <= 0) {
      throw new BadRequestException("입고 수량은 0보다 커야 합니다.");
    }

    return this.prisma.$transaction(async (tx) => {
      // 품목 확인
      const item = await tx.item.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          item_id: true,
          category: { select: { group: true } },
        },
      });
      if (!item) {
        throw new Error(`Item ${itemId} not found`);
      }

      const storeDate = new Date();
      const effExpiry =
        expiryDate ?? calcExpiryDate(item.category.group as CategoryGroup, storeDate);

      const lotId = await this.generateLotId(tx, item.item_id);

      // 기존 재고 확인
      const existing = await tx.inventory.findFirst({
        where: {
          warehouse_id: warehouseId,
          item_id: itemId,
          expiry_date: effExpiry,
        },
      });

      let inv;
      if (existing) {
        inv = await tx.inventory.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + newlyReceivedQty },
        });
      } else {
        const inventory_id = await this.generateInventoryId(tx);
        inv = await tx.inventory.create({
          data: {
            inventory_id,
            warehouse_id: warehouseId,
            item_id: itemId,
            lot_id: lotId,
            quantity: newlyReceivedQty,
            safety_stock: 0,
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

      const updatedOrder = await tx.vendorOrder.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          received_quantity: {
            increment: newlyReceivedQty, // ✅ 누적 업데이트
          },
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
  private async _receiveInternal(
    warehouseId: number,
    itemId: number,
    quantity: number,
    manufactureDate?: Date,
    expiryDate?: Date,
    isPartial?: boolean,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          item_id: true,
          category: { select: { group: true } },
        },
      });
      if (!item) throw new Error(`Item ${itemId} not found`);

      const storeDate = new Date();
      const effExpiry =
        expiryDate ?? calcExpiryDate(item.category.group as CategoryGroup, storeDate);

      const lotId = await this.generateLotId(tx, item.item_id);

      const existing = await tx.inventory.findFirst({
        where: {
          warehouse_id: warehouseId,
          item_id: itemId,
          expiry_date: effExpiry,
        },
      });

      let inv;
      if (existing) {
        inv = await tx.inventory.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        });
      } else {
        const inventory_id = await this.generateInventoryId(tx);
        inv = await tx.inventory.create({
          data: {
            inventory_id,
            warehouse_id: warehouseId,
            item_id: itemId,
            lot_id: lotId,
            quantity,
            safety_stock: 0,
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
      where: { warehouse_id: warehouseId },
      include: { item: true },
    });
    return inv.map((v) => this.loadEntity(v));
  }

  async findByWarehouseName(warehouseName: string) {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { name: warehouseName },
    });

    if (!warehouse) {
      throw new Error(`Warehouse not found: ${warehouseName}`);
    }

    const inv = await this.prisma.inventory.findMany({
      where: { warehouse_id: warehouse.id },
      include: { item: true },
    });

    return inv.map((v) => this.loadEntity(v));
  }

  async findLotsByItem(itemId: number) {
    return this.prisma.lotTrace.findMany({
      where: { item_id: itemId },
      orderBy: { received_date: "desc" },
    });
  }


  async findAll(status?: string) {
    const where = status ? { status: status as InventoryStatus } : {};
    const inv = await this.prisma.inventory.findMany({ where });
    return inv.map((v) => this.loadEntity(v));
  }
}
