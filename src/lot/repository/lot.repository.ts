import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { UpdateLotTraceDto } from "../dto/update-lot.dto";
import { LotEntity } from "../entity/lot.entity";

@Injectable()
export class LotTraceRepository {
    constructor(private readonly prisma: PrismaService) { }

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
            lot.action_type
        );
    }

    async findLotsByItem(itemId: number) {
        return this.prisma.lotTrace.findMany({
            where: { item_id: itemId },
            orderBy: { received_date: "desc" },
        });
    }
}