import { OrderStatus } from "@prisma/client";

export class VendorOrderEntity {
    constructor (
        public readonly vendor_order_id: string,
        public readonly vendor_id: number,
        public readonly item_id: string,
        public readonly quantity: number,
        public readonly status: OrderStatus
    ) {}
}