import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UpdateLotTraceDto } from "../dto/update-lot.dto";
import { LotEntity } from "../entity/lot.entity";
import { LotActionType } from "@prisma/client";

@Injectable()
export class LotTraceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private loadEntity(lot: any): LotEntity {
    return new LotEntity(
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
  }

  /** 전체 LOT 조회 */
  async findAll(): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      orderBy: { received_date: "desc" },
    });
    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** lot_id 단일 조회 */
  async findByLotId(lotId: string): Promise<LotEntity> {
    const lot = await this.prisma.lotTrace.findUnique({
      where: { lot_id: lotId },
    });

    if (!lot) throw new NotFoundException(`LOT '${lotId}'를 찾을 수 없습니다.`);
    return this.loadEntity(lot);
  }

  /** item_id 기준 조회 */
  async findByItem(itemId: number): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: { item_id: itemId },
      orderBy: { received_date: "desc" },
    });
    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** warehouse_id 기준 조회 */
  async findByWarehouse(warehouseId: number): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: { warehouse_id: warehouseId },
      orderBy: { received_date: "desc" },
    });
    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** inventory_id 기준 조회 */
  async findByInventory(inventoryId: number): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: { inventory_id: inventoryId },
      orderBy: { received_date: "desc" },
    });
    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** 출고되지 않은 LOT 조회 (shipment_id = null) */
  async findAvailableLots(itemId: number, warehouseId?: number): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: {
        item_id: itemId,
        shipment_id: null,
        ...(warehouseId ? { warehouse_id: warehouseId } : {}),
      },
      orderBy: { expiry_date: "asc" }, // 재고 출고 시 FEFO 적용
    });

    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** 기간별 조회 (received_date 기준) */
  async findByPeriod(start: Date, end: Date): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: {
        received_date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { received_date: "desc" },
    });

    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** 유통기한 임박 LOT (예: 7일 이하) */
  async findExpiringSoon(days: number): Promise<LotEntity[]> {
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
    });

    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** 완전히 만료된 LOT 조회 */
  async findExpired(): Promise<LotEntity[]> {
    const now = new Date();

    const lots = await this.prisma.lotTrace.findMany({
      where: {
        expiry_date: {
          lt: now,
        },
      },
      orderBy: { expiry_date: "asc" },
    });

    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  /** INBOUND만 조회 */
  async findInboundLot(): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: {
        action_type: LotActionType.INBOUND,
      },
      orderBy: { received_date:  "desc" },
    });

    return lots.map(
      (l) => this.loadEntity(l)
    );
  }

  async findOutboundLot(): Promise<LotEntity[]> {
    const lots = await this.prisma.lotTrace.findMany({
      where: {
        action_type: LotActionType.OUTBOUND,
      },
      orderBy: { received_date:  "desc" },
    });

    return lots.map(
      (l) => this.loadEntity(l)
    );
  }
  /** LOT 수정 (주로 출고 처리 시 사용) */
  async updateLot(lotId: string, dto: UpdateLotTraceDto): Promise<LotEntity> {
    const updated = await this.prisma.lotTrace.update({
      where: { lot_id: lotId },
      data: dto,
    });

    return this.loadEntity(updated);
  }
}
