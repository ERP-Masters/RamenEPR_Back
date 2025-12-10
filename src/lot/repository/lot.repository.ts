import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UpdateLotTraceDto } from "../dto/update-lot.dto";
import { LotEntity } from "../entity/lot.entity";
import { LotActionType } from "@prisma/client";

@Injectable()
export class LotTraceRepository {
  constructor(private readonly prisma: PrismaService) { }

  private loadEntity(lot: any): any {
    const entity = new LotEntity(
      lot.id,
      lot.lot_id,
      lot.item_id,
      lot.warehouse_id,
      lot.inventory_id,
      lot.manufacture_date,
      lot.expiry_date,
      lot.received_date,
      lot.shipment_id,
      lot.action_type
    );

    // 조인 데이터(문자열 변환용) 함께 반환
    return {
      ...entity,
      item_name: lot.item?.name ?? null,
      warehouse_name: lot.warehouse?.name ?? null,
      inventory_code: lot.inventory?.inventory_code ?? null,
      shipment_code: lot.shipment?.shipment_code ?? null,
    };
  }

  private include = {
    item: true,
    warehouse: true,
    inventory: true,
    shipment: true,
  };

  async findAll() {
    const lots = await this.prisma.lotTrace.findMany({
      orderBy: { received_date: "desc" },
      include: this.include,
    });
    return lots.map((l) => this.loadEntity(l));
  }

  async findByLotId(lotId: string) {
    const lot = await this.prisma.lotTrace.findUnique({
      where: { lot_id: lotId },
      include: this.include,
    });

    if (!lot) throw new NotFoundException(`LOT '${lotId}'를 찾을 수 없습니다.`);
    return this.loadEntity(lot);
  }

  async findByItem(itemId: number) {
    const lots = await this.prisma.lotTrace.findMany({
      where: { item_id: itemId },
      orderBy: { received_date: "desc" },
      include: this.include,
    });
    return lots.map((l) => this.loadEntity(l));
  }

  async findByWarehouse(warehouseId: number) {
    const lots = await this.prisma.lotTrace.findMany({
      where: { warehouse_id: warehouseId },
      orderBy: { received_date: "desc" },
      include: this.include,
    });
    return lots.map((l) => this.loadEntity(l));
  }

  async findByInventory(inventoryId: number) {
    const lots = await this.prisma.lotTrace.findMany({
      where: { inventory_id: inventoryId },
      orderBy: { received_date: "desc" },
      include: this.include,
    });
    return lots.map((l) => this.loadEntity(l));
  }

  async findAvailableLots(itemId: number, warehouseId?: number) {
    const lots = await this.prisma.lotTrace.findMany({
      where: {
        item_id: itemId,
        shipment_id: null,
        ...(warehouseId ? { warehouse_id: warehouseId } : {}),
      },
      orderBy: { expiry_date: "asc" },
      include: this.include,
    });

    return lots.map((l) => this.loadEntity(l));
  }

  async findByPeriod(start: Date, end: Date) {
    const lots = await this.prisma.lotTrace.findMany({
      where: {
        received_date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { received_date: "desc" },
      include: this.include,
    });

    return lots.map((l) => this.loadEntity(l));
  }

  async findExpiringSoon(days: number) {
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + days);

    const lots = await this.prisma.lotTrace.findMany({
      where: {
        expiry_date: {
          gte: now,
          lte: limit,
        },
      },
      orderBy: { expiry_date: "asc" },
      include: this.include,
    });

    return lots.map((l) => this.loadEntity(l));
  }

  async findExpired() {
    const now = new Date();

    const lots = await this.prisma.lotTrace.findMany({
      where: {
        expiry_date: { lt: now },
      },
      orderBy: { expiry_date: "asc" },
      include: this.include,
    });

    return lots.map((l) => this.loadEntity(l));
  }

  async findInboundLot() {
    const lots = await this.prisma.lotTrace.findMany({
      where: { action_type: LotActionType.INBOUND },
      orderBy: { received_date: "desc" },
      include: this.include,
    });

    return lots.map((l) => this.loadEntity(l));
  }

  async findOutboundLot() {
    const lots = await this.prisma.lotTrace.findMany({
      where: { action_type: LotActionType.OUTBOUND },
      orderBy: { received_date: "desc" },
      include: this.include,
    });

    return lots.map((l) => this.loadEntity(l));
  }

  async updateLot(lotId: string, dto: UpdateLotTraceDto) {
    const updated = await this.prisma.lotTrace.update({
      where: { lot_id: lotId },
      data: dto,
      include: this.include,
    });

    return this.loadEntity(updated);
  }
}
