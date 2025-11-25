// src/shipment/shipment.service.ts
import { Injectable } from "@nestjs/common";
import { ShipmentRepository } from "./repository/shipment.repository";
import { CreateShipmentDto } from "./dto/create-shipment.dto";

@Injectable()
export class ShipmentService {
  constructor(private readonly repo: ShipmentRepository) {}

  async createFromOrder(orderId: number, dto: CreateShipmentDto) {
    return this.repo.createFromOrder(orderId, dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    return this.repo.findById(id);
  }
}