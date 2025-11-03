import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  BadRequestException,
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
  async create(@Body() dto: CreateVendorOrderDto | CreateVendorOrderDto[]) {
    return this.vendorOrderService.create(dto);
  }

  // 전체 발주 조회
  @Get()
  async findAll() {
    return this.vendorOrderService.findAll();
  }

    // 기간별 조회
  @Get("period")
  async findByDateRange(
    @Query("start") start: string,
    @Query("end") end: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    //유효성 검사
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException("잘못된 날짜 형식입니다. YYYY-MM-DD 형식을 사용하세요.");
    }

    //날짜 순서 검사
    if (startDate > endDate) {
      throw new BadRequestException("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
    }

    //서비스 호출
    return this.vendorOrderService.findByDateRange(startDate, endDate);
  }

  // 단일 발주 조회
  @Get(":id")
  async findById(@Param("id") id: number) {
    return this.vendorOrderService.findById(+id);
  }

  // 거래처별 발주 조회
  @Get("vendor/:vendorId")
  async findByVendor(@Param("vendorId") vendorId: number) {
    return this.vendorOrderService.findByVendor(+vendorId);
  }

  // 상태별 조회
  @Get("status/:status")
  async findByStatus(@Param("status") status: OrderStatus) {
    return this.vendorOrderService.findByStatus(status);
  }

  //발주 상태 변경 (입고 자동 반영)
  @Patch(":id/status")
  async updateStatus(@Param("id") id: number, @Body("status") status: OrderStatus) {
    return this.vendorOrderService.updateStatus(+id, status);
  }

  // 발주 수정
  @Patch(":id")
  async update(@Param("id") id: number, @Body() dto: UpdateVendorOrderDto) {
    return this.vendorOrderService.update(+id, dto);
  }

  // 발주 취소
  @Patch(":id/cancel")
  async cancelOrder(@Param("id") id: number) {
    return this.vendorOrderService.cancelOrder(+id);
  }
}
