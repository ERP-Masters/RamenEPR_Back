import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { VendorOrderService } from "./vendorOrder.service";
import { CreateVendorOrderDto } from "./dto/createVendorOrder.dto";
import { UpdateVendorOrderDto } from "./dto/updateVendorOrder.dto";
import { OrderStatus } from "@prisma/client";

@Controller("vendor-order")
export class VendorOrderController {
  constructor(private readonly vendorOrderService: VendorOrderService) {}

  // 거래처 발주 생성
  @Post()
  async create(@Body() dto: CreateVendorOrderDto) {
    return this.vendorOrderService.create(dto);
  }

  // 전체 발주 조회
  @Get()
  async findAll() {
    return this.vendorOrderService.findAll();
  }

  // 단일 발주 조회
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.vendorOrderService.findById(+id);
  }

  // 거래처별 발주 조회
  @Get("vendor/:vendorId")
  async findByVendor(@Param("vendorId") vendorId: string) {
    return this.vendorOrderService.findByVendor(+vendorId);
  }

  // 상태별 조회
  @Get("status/:status")
  async findByStatus(@Param("status") status: OrderStatus) {
    return this.vendorOrderService.findByStatus(status);
  }

  // 기간별 조회
  @Get("period")
  async findByDateRange(
    @Query("start") start: string,
    @Query("end") end: string,
  ) {
    return this.vendorOrderService.findByDateRange(
      new Date(start),
      new Date(end),
    );
  }

  // 발주 수정
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateVendorOrderDto) {
    return this.vendorOrderService.update(+id, dto);
  }

  // 발주 취소
  @Patch(":id/cancel")
  async cancelOrder(@Param("id") id: string) {
    return this.vendorOrderService.cancelOrder(+id);
  }
}
