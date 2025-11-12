import { InventoryStatus, LotActionType } from "@prisma/client";

export class InventoryEntity {
    constructor(
        public readonly id: number,
        public readonly inventory_id: string,
        public readonly warehouse_id: number,
        public readonly item_id: number,
        public readonly lot_id: string,
        public readonly quantity: number,
        public readonly safety_stock: number,
        public readonly store_date: Date,
        public readonly expiry_date: Date,
        public readonly action_type: LotActionType,
    ) {}
}