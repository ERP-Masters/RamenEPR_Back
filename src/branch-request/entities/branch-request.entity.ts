import { OrderRequest } from "@prisma/client";

export class BranchRequestEntity {
    constructor(
        public readonly id: number,
        public readonly order_id: string,
        public readonly branch_id: number,
        public readonly item_id: number,
        public readonly quantity: number,
        public readonly unit_price: number,
        public readonly amount: number,
        public readonly request_note: string,
        public readonly status: OrderRequest,
        public readonly desired_due_date: Date,
    ) {}
}