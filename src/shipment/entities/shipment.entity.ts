// src/shipment/entities/shipment.entity.ts
import { DeliveryStatus } from "@prisma/client";

export class ShipmentEntity {
  constructor(
    public readonly id: number,
    public readonly shipment_id: string,
    public readonly order_id: number,
    public readonly warehouse_id: number,
    public readonly branch_id: number,
    public readonly shipped_date: Date,
    public readonly due_date: Date,
    public readonly delivery_status: DeliveryStatus,
  ) {}
}