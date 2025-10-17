import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { WarehouseEntity } from "../entities/warehouse.entity";
import { UseState } from "@prisma/client";

@Injectable()
export class WarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 창고 등록
  async create(data: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouses = await this.prisma.warehouse.create({ data });
    return new WarehouseEntity(
      warehouses.warehouse_id,
      warehouses.name,
      warehouses.location,
      warehouses.isused,
      warehouses.created_at,
    );
  }

  //전체 창고 조회
  async findAll(): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany();
    return warehouses.map(
      (w) =>
        new WarehouseEntity(
          w.warehouse_id,
          w.name,
          w.location,
          w.isused,
          w.created_at,
        ),
    );
  }

  async findNotUsedWh(): Promise<WarehouseEntity[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isused: UseState.NOTUSED },
    });
    return warehouses.map(
      (w) =>
        new WarehouseEntity(
          w.warehouse_id,
          w.name,
          w.location,
          w.isused,
          w.created_at,
        )
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
      (w) =>
        new WarehouseEntity(
          w.warehouse_id,
          w.name,
          w.location,
          w.isused,
          w.created_at,
        ),
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

    return new WarehouseEntity(
      warehouse.warehouse_id,
      warehouse.name,
      warehouse.location,
      warehouse.isused,
      warehouse.created_at,
    );
  }

  //창고 수정
  async update(id: number, data: CreateWarehouseDto): Promise<WarehouseEntity> {
    const warehouses = await this.prisma.warehouse.update({
      where: { warehouse_id: id },
      data,
    });

    return new WarehouseEntity(
      warehouses.warehouse_id,
      warehouses.name,
      warehouses.location,
      warehouses.isused,
      warehouses.created_at,
    );
  }

  // 창고 수정
  async changeUseState(id: number, state: UseState): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.update({
      where: { warehouse_id: id },
      data: { isused: state }
    });

    return new WarehouseEntity(
      warehouse.warehouse_id,
      warehouse.name,
      warehouse.location,
      warehouse.isused,
      warehouse.created_at,
    )
  }

}
