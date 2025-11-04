import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateVendorOrderDto } from "../dto/createVendorOrder.dto";
import { UpdateVendorOrderDto } from "../dto/updateVendorOrder.dto";
import { VendorOrderEntity } from "../entities/vendorOrder.entity";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class VendorOrderRepository {
  constructor(private readonly prisma: PrismaService) { }


  private loadEntity(order: any): VendorOrderEntity {
    return new VendorOrderEntity(
      order.vendor_order_id,
      order.wh_id,
      order.vendor_id,
      order.item_id,
      order.quantity,
      order.status,
    );
  }

  /**
   * 거래처별 발주번호를 생성한다.
   * 형식: VO_<VENDORCODE>_<YYMMDD>_<SEQ>
   * - 거래처 단위로 시퀀스 관리
   * - 날짜가 바뀌면 시퀀스는 1부터 다시 시작
   */
  private async generateVendorOrderId(vendor_id: number): Promise<string> {
    // 거래처 코드 조회
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendor_id },
      select: { vendor_id: true },
    });

    if (!vendor || !vendor.vendor_id) {
      throw new Error(`거래처 ID ${vendor_id}의 코드 정보를 찾을 수 없습니다.`);
    }

    const vendorCode = vendor.vendor_id.toUpperCase().replace("VD_", "");

    // 날짜 포맷: YYMMDD
    const date = new Date();
    const formattedDate = date.toISOString().slice(2, 10).replace(/-/g, "");

    // 거래처별 + 날짜별 시퀀스 카운트
    const count = await this.prisma.vendorOrder.count({
      where: {
        vendor_order_id: {
          startsWith: `VO_${vendorCode}_${formattedDate}_`,
        },
      },
    });

    // 시퀀스 번호 3자리 고정
    const seq = (count + 1).toString().padStart(3, "0");

    // 최종 ID 생성
    return `VO_${vendorCode}_${formattedDate}_${seq}`;
  }

  async create(data: CreateVendorOrderDto): Promise<VendorOrderEntity>;
  async create(data: CreateVendorOrderDto[]): Promise<VendorOrderEntity[]>;

  /** 거래처 발주 생성 */
  async create(
    data: CreateVendorOrderDto | CreateVendorOrderDto[],
  ): Promise<VendorOrderEntity | VendorOrderEntity[]> {
    if (Array.isArray(data)) {
      const createdOrders: VendorOrderEntity[] = [];
      //여러 개를 한 번에 발주 할 시 생성되는 ID 번호 고정
      const vendor_order_id = await this.generateVendorOrderId(data[0].vendor_id);
      for (const order of data) {
        const created = await this.prisma.vendorOrder.create({
          data: {
            vendor_order_id,
            vendor_id: order.vendor_id,
            item_id: order.item_id,
            wh_id: order.wh_id,
            quantity: order.quantity,
            status: order.status ?? OrderStatus.PENDING,
          },
        });

        createdOrders.push(this.loadEntity(created));
      }

      return createdOrders;
    }

    // 단일 건 처리
    const vendor_order_id = await this.generateVendorOrderId(data.vendor_id);

    const order = await this.prisma.vendorOrder.create({
      data: {
        vendor_order_id,
        vendor_id: data.vendor_id,
        item_id: data.item_id,
        wh_id: data.wh_id,
        quantity: data.quantity,
        status: data.status ?? OrderStatus.PENDING,
      },
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
      data: { status: OrderStatus.CANCELED },
    });

    return this.loadEntity(order);
  }
}