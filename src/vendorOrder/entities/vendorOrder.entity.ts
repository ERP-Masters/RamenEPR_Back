import { OrderStatus } from "@prisma/client";

export class VendorOrderEntity {
    constructor (
        public readonly id: number,
        public readonly vendor_order_id: string,
        public readonly wh_id: number,
        public readonly vendor_id: number,
        public readonly item_id: number,
        public readonly quantity: number,
        public readonly received_quantity: number,
        public readonly status: OrderStatus
    ) {}
}