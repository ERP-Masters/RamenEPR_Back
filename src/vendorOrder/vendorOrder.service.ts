import { Injectable, Inject, NotFoundException, forwardRef } from "@nestjs/common";
import { VendorOrderRepository } from "./repository/vendorOrder.repository";
import { CreateVendorOrderDto } from "./dto/createVendorOrder.dto";
import { UpdateVendorOrderDto } from "./dto/updateVendorOrder.dto";
import { VendorOrderEntity } from "./entities/vendorOrder.entity";
import { OrderStatus } from "@prisma/client";
import { InventoryService } from "src/inventory/inventory.service";

@Injectable()
export class VendorOrderService {
  constructor(
    private readonly vendorOrderRepository: VendorOrderRepository,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) { }

  // 거래처 발주 생성
  async create(data: CreateVendorOrderDto | CreateVendorOrderDto[]):
    Promise<VendorOrderEntity | VendorOrderEntity[]> {
    if (Array.isArray(data)) {
      const results: VendorOrderEntity[] = [];
      for (const order of data) {
        const created = await this.vendorOrderRepository.create(order);
        results.push(created);
      }
      return results;
    }

    // 단일 처리
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

  // 발주 상태 변경 
  async updateStatus(
    id: number,
    status: OrderStatus,
    partialQuantity?: number,
  ): Promise<VendorOrderEntity> {
    // 항상 최신 상태로 다시 조회
    let order = await this.vendorOrderRepository.findById(id);
    if (!order) throw new NotFoundException(`발주 ID ${id}를 찾을 수 없습니다.`);

    // 부분입고 로직
    if (status === OrderStatus.PARTIALLY && partialQuantity) {
      // 최신 상태 재조회
      order = await this.vendorOrderRepository.findById(id);
      // 부분입고 처리
      const result = await this.inventoryService.receivePartialFromOrder(
        order,
        partialQuantity,
      );

      // 처리 후 다시 최신 상태 반영
      const updatedOrder = await this.vendorOrderRepository.findById(id);
      return updatedOrder;
    }

    // 일반 상태 변경
    const updated = await this.vendorOrderRepository.update(id, { status });

    // 전체입고 처리
    if (status === OrderStatus.COMPLETED) {
      await this.inventoryService.receiveStockFromOrder(updated);

      await this.vendorOrderRepository.update(id, {
        received_quantity: order.quantity,
        status: OrderStatus.COMPLETED,
      })
    }

    return updated;
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
