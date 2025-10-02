import { Injectable, NotFoundException } from "@nestjs/common";
import { WarehouseRepository } from "./repository/warehouse.repository";
import { WarehouseEntity } from "./entities/warehouse.entity";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  // 창고 생성
  async create(dto: CreateWarehouseDto): Promise<WarehouseEntity> {
    return this.warehouseRepository.create(dto);
  }

  // 모든 창고 조회
  async findAll(): Promise<WarehouseEntity[]> {
    return this.warehouseRepository.findAll();
  }

  // 특정 위치(location) 기준 조회
  async findByLocation(loc: string): Promise<WarehouseEntity[]> {
    return this.warehouseRepository.findBylocation(loc);
  }

  // 창고 ID 기준 조회
  async findByWarehouseId(id: number): Promise<WarehouseEntity> {
    const warehouse = await this.warehouseRepository.findByWarehouseId(id);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }
    return warehouse;
  }

  // 창고 정보 수정
  async update(id: number, dto: CreateWarehouseDto): Promise<WarehouseEntity> {
    return this.warehouseRepository.update(id, dto);
  }

  // 창고 삭제
  async remove(id: number): Promise<void> {
    return this.warehouseRepository.remove(id);
  }
}