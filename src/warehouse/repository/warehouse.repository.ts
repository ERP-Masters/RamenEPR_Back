import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateWarehouseDto } from "../dto/create-warehouse.dto";
import { WarehouseEntity } from "../entities/warehouse.entity";

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
          w.created_at,
        ),
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
      warehouses.created_at,
    );
  }

  // 창고 삭제
  async remove(id: number): Promise<void> {
    await this.prisma.warehouse.delete({
      where: { warehouse_id: id },
    });
  }
}
