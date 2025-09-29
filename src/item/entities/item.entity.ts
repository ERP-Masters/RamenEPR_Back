import { Unit } from '@prisma/client';

export class ItemEntity {
    constructor (
        public readonly id: number,
        public readonly item_id: string,
        public readonly category_id: number,
        public readonly name: string,
        public readonly unit: Unit, 
        public readonly unit_price: number,
        public readonly expiry_date: Date,
        public readonly created_at: Date,
        public readonly vendor_name?: string,
    ) {}
}