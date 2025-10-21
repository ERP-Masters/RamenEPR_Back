import { Injectable, NotFoundException } from "@nestjs/common";
import { WarehouseRepository } from "./repository/warehouse.repository";
import { WarehouseEntity } from "./entities/warehouse.entity";
import { CreateWarehouseDto } from "./dto/create-warehouse.dto";
import { UseState } from "@prisma/client";

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

  async findNotUsedWh(): Promise<WarehouseEntity[]> {
    return this.warehouseRepository.findNotUsedWh();
  }
  // 특정 위치(location) 기준 조회
  async findByLocation(loc: string): Promise<WarehouseEntity[]> {
    return this.warehouseRepository.findByLocation(loc);
  }

  // 창고 ID 기준 조회
  async findByWarehouseId(id: string): Promise<WarehouseEntity> {
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
  async changeUseState(id: number, state: UseState):
    Promise<{ message: string; warehouse: WarehouseEntity }>{
      const updated = await this.warehouseRepository.changeUseState(
        id, state
      );
      return {
            message: "창고 ${id}의 상태가 ${state}로 변경되었습니다.",
            warehouse: updated,
      }
    }
}