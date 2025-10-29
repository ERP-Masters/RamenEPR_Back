import { Injectable } from "@nestjs/common";
import { CreateInventoryDto } from "../dto/create-inventory.dto";
import { UpdateInventoryDto } from "../dto/update-inventory.dto";
import { PrismaService } from "src/database/prisma.service";
import { InventoryEntity } from "../entities/inventory.entity";

@Injectable()
export class InventoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    private loadEntity(inven: any): InventoryEntity {
        return new InventoryEntity (
            inven.id,
            inven.inventory_id,
            inven.warehouse_id,
            inven.item_id,
            inven.quantity,
            inven.satefty_stock,
            inven.store_date,
            inven.expiry_date
        );
    }

    private async generateInventoryId(tx: any): Promise<string> {
        const count = await tx.inventory.count();
        return `INV_${(count + 1).toString().padStart(4, "0")}`;
    }
    
}