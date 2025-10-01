import { Injectable, NotFoundException } from "@nestjs/common";
import { UnitRepository } from "./repository/unit.repository";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { UnitEntity } from "./entities/unit.entity";

@Injectable()
export class UnitService {
    constructor(private readonly unitRepository: UnitRepository) {}

    async create(dto: CreateUnitDto): Promise<UnitEntity> {
        return this.unitRepository.create(dto);
    }

    async findAll(): Promise<UnitEntity[]> {
         return this.unitRepository.findAll();
    }

    async update(id: number, dto: CreateUnitDto): Promise<UnitEntity> {
        return this.unitRepository.update(id, dto);
    }

    async remove(id: number): Promise<void> {
        return this.unitRepository.remove(id);
    }
}