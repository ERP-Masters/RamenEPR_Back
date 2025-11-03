import { Injectable } from "@nestjs/common";
import { CreateInventoryDto } from "../dto/create-inventory.dto";
import { UpdateInventoryDto } from "../dto/update-inventory.dto";
import { PrismaService } from "src/database/prisma.service";
import { InventoryEntity } from "../entities/inventory.entity";
import { InventoryStatus } from "@prisma/client";


@Injectable()
export class InventoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    private loadEntity(inven: any): InventoryEntity {
        return new InventoryEntity(
            inven.id,
            inven.inventory_id,
            inven.warehouse_id,
            inven.item_id,
            inven.quantity,
            inven.safety_stock,
            inven.store_date,
            inven.expiry_date
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
            where: {
                lot_id: {
                    startsWith: prefix
                }
            }
        });
        return `${prefix}${(seq + 1).toString().padStart(4, "0")}`;
    }

    async receive(
        warehouseId: number,
        itemId: number,
        quantity: number,
        manufactureDate?: Date,
        expiryDate?: Date,
    ) {
        return this.prisma.$transaction(async (tx) => {
            // 품목 메타 조회
            const item = await tx.item.findUnique({
                where: { id: itemId },
                select: { id: true, item_id: true, expiry_date: true },
            });
            if (!item) throw new Error(`Item ${itemId} not found`);

            const effExpiry = expiryDate ?? item.expiry_date;
            if (!effExpiry) throw new Error("expiry_date is required or item.expiry_date must exist");

            // 동일(창고/아이템/유통기한) 재고 찾기
            const existing = await tx.inventory.findUnique({
                where: {
                    warehouse_id_item_id_expiry_date: {
                        warehouse_id: warehouseId,
                        item_id: itemId,
                        expiry_date: effExpiry,
                    },
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
                        quantity,
                        safety_stock: 0,
                        store_date: new Date(),
                        expiry_date: effExpiry,
                        status: InventoryStatus.NORMAL,
                    },
                });
            }

            // LOT 생성
            const lotId = await this.generateLotId(tx, item.item_id);
            await tx.lotTrace.create({
                data: {
                    lot_id: lotId,
                    item_id: itemId,
                    warehouse_id: warehouseId,
                    inventory_id: inv.id,
                    manufacture_date: manufactureDate ?? new Date(),
                    expiry_date: effExpiry,
                },
            });

            return inv;
        });
    }
    /** 창고별 조회 */
    async findByWarehouse(warehouseId: number) {
        const inv = await this.prisma.inventory.findMany({
            where: { warehouse_id: warehouseId },
            include: { item: true },
        });
        return inv.map((v) => this.loadEntity(v));
    }

    /** LOT 조회 */
    async findLotsByItem(itemId: number) {
        return this.prisma.lotTrace.findMany({
            where: { item_id: itemId },
            orderBy: { received_date: "desc" },
        });
    }

    /** 전체 재고 조회 */
    async findAll(status?: string) {
        const where = status ? { status: status as InventoryStatus } : {};
        const inv = await this.prisma.inventory.findMany({ where });
        return inv.map((v) => this.loadEntity(v));
    }

}