import { Injectable, NotFoundException } from "@nestjs/common";
import { UnitRepository } from "./repository/unit.repository";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { UnitEntity } from "./entities/unit.entity";
import { UseState } from "@prisma/client";

@Injectable()
export class UnitService {
    constructor(private readonly unitRepository: UnitRepository) {}

    async create(dto: CreateUnitDto): Promise<UnitEntity> {
        return this.unitRepository.create(dto);
    }

    async findAll(): Promise<UnitEntity[]> {
         return this.unitRepository.findAll();
    }

    async findNotUsedUnit(): Promise<UnitEntity[]> {
        return this.unitRepository.findNotUsedUnit();
    }

    async update(id: number, dto: CreateUnitDto): Promise<UnitEntity> {
        return this.unitRepository.update(id, dto);
    }

    async changeUseState(id: number, state: UseState): 
        Promise<{message: string; unit: UnitEntity }> {
        const updated = await this.unitRepository.changeUseState(id, state);
        
        return {
            message: "단위 ${id}의 상태가 ${state}로 변경되었습니다.",
            unit: updated
        }
    }
}