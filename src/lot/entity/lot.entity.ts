import { LotActionType } from "@prisma/client";

export class LotEntity {
    constructor (
        public readonly id: number,
        public readonly lot_id: string,
        public readonly item_id: number,
        public readonly warehouse_id: number,
        public readonly inventory_id: number,
        public readonly manufacture_date: Date,
        public readonly expiry_date: Date,
        public readonly received_date: Date,
        public readonly action_type: LotActionType,
    ) {}
}