// src/shipment/shipment.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from "@nestjs/common";
import { ShipmentService } from "./shipment.service";
import { CreateShipmentDto } from "./dto/create-shipment.dto";

@Controller("shipment")
export class ShipmentController {
  constructor(private readonly service: ShipmentService) {}

  @Post("order/:orderId")
  async createFromOrder(
    @Param("orderId") orderId: string,
    @Body() dto: CreateShipmentDto,
  ) {
    return this.service.createFromOrder(+orderId, dto);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.service.findById(+id);
  }
}