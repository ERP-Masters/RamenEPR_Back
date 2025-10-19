import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { WarehouseEntity } from "../entities/warehouse.entity";
import { UseState } from "@prisma/client";

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  private loadEntity(warehouse: any): WarehouseEntity {
    return new WarehouseEntity(
      warehouse.warehouse_id,
      warehouse.name,
      warehouse.location,
      warehouse.isused,
      warehouse.created_at,
    );
  }

  // 창고 등록
  async create(data: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouses = await this.prisma.warehouse.create({ data });

    return this.loadEntity(warehouses);
  }

  //전체 창고 조회
  async findAll(): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany();
   
    return warehouses.map(
      (w) => this.loadEntity(w)
    );
  }

  async findNotUsedWh(): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isused: UseState.NOTUSED },
    });
    
    return warehouses.map(
      (w) => this.loadEntity(w)
    );
  }
  //위치로 검색
  async findByLocation(loc: string): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: {
        location: {
          contains: loc,
        },
      },
    });

    return warehouses.map(
      (w) => this.loadEntity(w)
    );
  }

  //창고 ID로 검색 (Null-safe)
  async findByWarehouseId(id: number): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: {
        warehouse_id: id,
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.loadEntity(warehouse);
  }

  //창고 수정
  async update(id: number, data: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouses = await this.prisma.warehouse.update({
      where: { warehouse_id: id },
      data,
    });

    return this.loadEntity(warehouses);
  }

  // 창고 수정
  async changeUseState(id: number, state: UseState): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.update({
      where: { warehouse_id: id },
      data: { isused: state }
    });

    return this.loadEntity(warehouse);
  }

}
