// src/shipment/dto/create-shipment.dto.ts
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateShipmentDto {
  @IsNotEmpty()
  @IsInt()
  warehouse_id: number;
}