export class ItemEntity {
    constructor (
        public readonly item_id: string,
        public readonly category_id: number,
        public readonly name: string,
        public readonly unit_id: number,
        public readonly vendor_id: number,
        public readonly unit_price: number,
        public readonly expiry_date: Date
    ) {}
}