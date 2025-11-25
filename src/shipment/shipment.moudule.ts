// src/shipment/shipment.module.ts
import { Module } from "@nestjs/common";
import { ShipmentController } from "./shipment.controller";
import { ShipmentService } from "./shipment.service";
import { ShipmentRepository } from "./repository/shipment.repository";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentRepository, PrismaService],
  exports: [ShipmentService],
})
export class ShipmentModule {}