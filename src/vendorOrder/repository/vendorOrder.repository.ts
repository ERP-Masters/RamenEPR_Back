import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateVendorOrderDto } from "../dto/createVendorOrder.dto";
import { UpdateVendorOrderDto } from "../dto/updateVendorOrder.dto";
import { VendorOrderEntity } from "../entities/vendorOrder.entity";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class VendorOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** ✅ Entity 변환 (중복 제거용) */
  private loadEntity(order: any): VendorOrderEntity {
    return new VendorOrderEntity(
      order.vendor_order_id,
      order.vendor_id,
      order.item_id,
      order.quantity,
      order.status,
    );
  }

  /**거래처 발주 생성 */
  async create(data: CreateVendorOrderDto): Promise<VendorOrderEntity> {
    const order = await this.prisma.vendorOrder.create({
      data,
    });

    return this.loadEntity(order);
  }

  /**전체 발주 조회*/
  async findAll(): Promise<VendorOrderEntity[]> {
    const orders = await this.prisma.vendorOrder.findMany({
      orderBy: { created_at: "desc" },
    });

    if (!orders.length) {
      throw new NotFoundException("현재 등록된 거래처 발주가 없습니다.");
    }

    return orders.map((o) => this.loadEntity(o));
  }

  /**단일 발주 조회 (ID 기준)*/
  async findById(id: number): Promise<VendorOrderEntity> {
    const order = await this.prisma.vendorOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`ID ${id}번 발주를 찾을 수 없습니다.`);
    }

    return this.loadEntity(order);
  }

  /**거래처별 발주 조회*/
  async findByVendor(vendorId: number): Promise<VendorOrderEntity[]> {
    const orders = await this.prisma.vendorOrder.findMany({
      where: { vendor_id: vendorId },
      orderBy: { created_at: "desc" },
    });

    if (!orders.length) {
      throw new NotFoundException(`거래처 ID ${vendorId}의 발주 내역이 없습니다.`);
    }

    return orders.map((o) => this.loadEntity(o));
  }

  /**상태별 조회*/
  async findByStatus(status: OrderStatus): Promise<VendorOrderEntity[]> {
    const orders = await this.prisma.vendorOrder.findMany({
      where: { status },
      orderBy: { created_at: "desc" },
    });

    if (!orders.length) {
      throw new NotFoundException(`${status} 상태의 발주가 없습니다.`);
    }

    return orders.map((o) => this.loadEntity(o));
  }

  /**기간별 조회*/
  async findByDateRange(start: Date, end: Date): Promise<VendorOrderEntity[]> {
    const orders = await this.prisma.vendorOrder.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { created_at: "desc" },
    });

    if (!orders.length) {
      throw new NotFoundException("해당 기간에 등록된 발주가 없습니다.");
    }

    return orders.map((o) => this.loadEntity(o));
  }

  /**발주 수정*/
  async update(id: number, data: UpdateVendorOrderDto): Promise<VendorOrderEntity> {
    const order = await this.prisma.vendorOrder.update({
      where: { id },
      data,
    });

    return this.loadEntity(order);
  }

  /**발주 취소*/
  async cancelOrder(id: number): Promise<VendorOrderEntity> {
    const order = await this.prisma.vendorOrder.update({
      where: { id },
      data: { status: OrderStatus.CANCLE },
    });

    return this.loadEntity(order);
  }
}