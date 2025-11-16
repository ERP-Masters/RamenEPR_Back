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
        public readonly unit_price: number, //발주 당시 단가.
        public readonly amount: number,//발주 총 금액
        public readonly status: OrderStatus
    ) {}
}