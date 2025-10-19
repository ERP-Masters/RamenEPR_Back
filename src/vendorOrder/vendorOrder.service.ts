import { Injectable, NotFoundException } from "@nestjs/common";
import { VendorOrderRepository } from "./repository/vendorOrder.repository";
import { CreateVendorOrderDto } from "./dto/createVendorOrder.dto";
import { UpdateVendorOrderDto } from "./dto/updateVendorOrder.dto";
import { VendorOrderEntity } from "./entities/vendorOrder.entity";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class VendorOrderService {
  constructor(private readonly vendorOrderRepository: VendorOrderRepository) {}

  // 거래처 발주 생성
  async create(data: CreateVendorOrderDto): Promise<VendorOrderEntity> {
    return this.vendorOrderRepository.create(data);
  }

  // 전체 거래처 발주 조회
  async findAll(): Promise<VendorOrderEntity[]> {
    return this.vendorOrderRepository.findAll();
  }

  // 단일 발주 조회
  async findById(id: number): Promise<VendorOrderEntity> {
    const order = await this.vendorOrderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`ID ${id}번 발주를 찾을 수 없습니다.`);
    }
    return order;
  }

  // 거래처별 발주 조회
  async findByVendor(vendorId: number): Promise<VendorOrderEntity[]> {
    return this.vendorOrderRepository.findByVendor(vendorId);
  }

  // 상태별 조회
  async findByStatus(status: OrderStatus): Promise<VendorOrderEntity[]> {
    return this.vendorOrderRepository.findByStatus(status);
  }

  // 기간별 조회
  async findByDateRange(start: Date, end: Date): Promise<VendorOrderEntity[]> {
    return this.vendorOrderRepository.findByDateRange(start, end);
  }

  // 발주 수정 (수량, 상태 등)
  async update(id: number, data: UpdateVendorOrderDto): Promise<VendorOrderEntity> {
    return this.vendorOrderRepository.update(id, data);
  }

  // 발주 취소 (삭제 대신 상태 변경)
  async cancelOrder(id: number): Promise<VendorOrderEntity> {
    return this.vendorOrderRepository.cancelOrder(id);
  }
}
