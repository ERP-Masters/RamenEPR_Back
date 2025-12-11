import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { LotTraceService } from "./lot.service";
import { LotEntity } from "./entity/lot.entity";
import { UpdateLotTraceDto } from "./dto/update-lot.dto";
import { LotActionType } from "@prisma/client";


@Controller("lot")
export class LotTraceController {
  constructor(private readonly service: LotTraceService) { }
  private convertResponse(lot: any) {
    return {
      id: lot.id,
      lot_id: lot.lot_id,

      item_id: lot.item_name ?? lot.item_id,
      warehouse_id: lot.warehouse_name ?? lot.warehouse_id,
      inventory_id: lot.inventory_code ?? lot.inventory_id,
      shipment_id: lot.shipment_code ?? lot.shipment_id,

      manufacture_date: lot.manufacture_date,
      expiry_date: lot.expiry_date,
      received_date: lot.received_date,

      action_type: lot.action_type,
    };
  }

  private convertArrayResponse(lots: any[]) {
    return lots.map((lot) => this.convertResponse(lot));
  }

  @Get()
  async findAll() {
    const result = await this.service.findAll();
    return this.convertArrayResponse(result);
  }

  @Get('lot/:lotId')
  async findByLotId(@Param("lotId") lotId: string) {
    const result = await this.service.findByLotId(lotId);
    return this.convertResponse(result);
  }

  @Get('item/:itemId')
  async findByItemId(@Param("itemId") itemId: number) {
    const result = await this.service.findByItem(itemId);
    return this.convertArrayResponse(result);
  }

  @Get("warehouse/:warehouseId")
  async findByWarehouse(@Param("warehouseId") warehouseId: number) {
    const result = await this.service.findByWarehouse(warehouseId);
    return this.convertArrayResponse(result);
  }

  @Get('inventory/:inventoryId')
  async findByInventory(@Param("inventoryId") inventoryId: number) {
    const result = await this.service.findByInventory(inventoryId);
    return this.convertArrayResponse(result);
  }

  @Get("available")
  async findAvailableLots(
    @Query("itemId") itemId: number,
    @Query("warehouseId") warehouseId?: number
  ) {
    const result = await this.service.findAvailableLots(itemId, warehouseId);
    return this.convertArrayResponse(result);
  }

  @Get("period")
  async findByPeriod(
    @Query("start") start: string,
    @Query("end") end: string
  ) {
    const result = await this.service.findByPeriod(new Date(start), new Date(end));
    return this.convertArrayResponse(result);
  }

  @Get("expiring-soon")
  async findExpiringSoon(@Query("days") days: string) {
    const result = await this.service.findExpiringSoon(Number(days));
    return this.convertArrayResponse(result);
  }

  @Get("expired")
  async findExpired() {
    const result = await this.service.findExpired();
    return this.convertArrayResponse(result);
  }

  @Get('inbound')
  async findInboundLot() {
    const result = await this.service.findInboundLot();
    return this.convertArrayResponse(result);
  }

  @Get('outbound')
  async findOutboundLot() {
    const result = await this.service.findOutboundLot();
    return this.convertArrayResponse(result);
  }

  @Patch(":lotId")
  async updateLot(
    @Param("lotId") lotId: string,
    @Body() dto: UpdateLotTraceDto
  ) {
    const result = await this.service.updateLot(lotId, dto);
    return this.convertResponse(result);
  }
}

