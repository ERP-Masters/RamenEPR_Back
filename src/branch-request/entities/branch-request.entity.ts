import { OrderStatus } from "@prisma/client";

export class BranchRequestEntity {
  constructor(
    public readonly id: number,
    public readonly order_id: string,
    public readonly branch_id: number,
    public readonly items: BranchRequestItemEntity[],
    public readonly request_note: string | null,
    public readonly status: OrderStatus,
    public readonly created_at: Date,
    public readonly desired_due_date: Date,
  ) {}
}

export class BranchRequestItemEntity {
  constructor(
    public readonly id: number,
    public readonly request_id: number,
    public readonly item_id: number,
    public readonly quantity: number,
    public readonly unit_price: number,
    public readonly amount: number,
  ) {}
}
