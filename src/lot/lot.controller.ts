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
import { UpdateLotTraceDto } from "./dto/update-lot.dto";
import { LotActionType } from "@prisma/client";

@Controller("lot")
export class LotTraceController {
    constructor(private readonly service: LotTraceService) {}

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get('lot/:lotId')
    async findByLotId(
      @Param("lotId")
      lotId: string
    ) {
      return this.service.findByLotId(lotId);
    }

    @Get('item/:itemId')
    async findByItemId(
      @Param("itemId")
      itemId: number
    ) {
      return this.service.findByItem(itemId);
    }

    @Get("warehouse/:warehouseId")
    async findByWarehosue(
      @Param("warehouseId")
      warehouseId: number
    ) {
       return this.service.findByWarehouse(warehouseId);
    }

    @Get('inventory/:inventoryId') 
    async findByInventory(
      @Param("inventoryId")
      inventoryId: number
    ) {
      return this.service.findByInventory(inventoryId);
    }

     @Get("available")
    async findAvailableLots(
        @Query("itemId") itemId: string,
        @Query("warehouseId") warehouseId?: string
    ) {
        return this.service.findAvailableLots(
            Number(itemId),
            warehouseId ? Number(warehouseId) : undefined
        );
    }

    @Get("period")
    async findByPeriod(
        @Query("start") start: string,
        @Query("end") end: string
    ) {
        return this.service.findByPeriod(new Date(start), new Date(end));
    }

    @Get("expiring-soon")
    async findExpiringSoon(
      @Query("days") 
      days: string
    ) {
        return this.service.findExpiringSoon(Number(days));
    }

    @Get("expired")
    async findExpired() {
        return this.service.findExpired();
    }

    @Patch(":lotId")
    async updateLot(
        @Param("lotId") lotId: string,
        @Body() dto: UpdateLotTraceDto
    ) {
        return this.service.updateLot(lotId, dto);
    }
}