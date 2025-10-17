import { UseState } from "@prisma/client";

export class WarehouseEntity {
  constructor(
    public readonly warehouse_id: number,
    public readonly name: string,
    public readonly location: string,
    public readonly isused: UseState,
    public readonly created_at: Date
  ) {}
}