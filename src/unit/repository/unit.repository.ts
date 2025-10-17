import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UnitEntity } from "../entities/unit.entity";
import { CreateUnitDto } from "../dto/create-unit.dto";
import { UseState } from "@prisma/client";


@Injectable()
export class UnitRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUnitDto): Promise<UnitEntity> {
        const units = await this.prisma.unit.create({ 
            data 
        });
        return new UnitEntity(
            units.unit_id,
            units.code,
            units.name,
            units.isused
        );
    }

    async findAll(): Promise<UnitEntity[]> {
        const units = await this.prisma.unit.findMany();
        return units.map(
            unit => 
                new UnitEntity(
                    unit.unit_id,
                    unit.code,
                    unit.name, 
                    unit.isused
                ));
    }

    async findNotUsedUnit(): Promise<UnitEntity[]> {
        const units = await this.prisma.unit.findMany({
            where: { isused: UseState.NOTUSED }
        });

        return units.map(
            unit => new UnitEntity(
                unit.unit_id,
                unit.code,
                unit.name, 
                unit.isused
            )
        );
    }

    async update(id: number, data: CreateUnitDto): Promise<UnitEntity> {
        const units = await this.prisma.unit.update({
            where: { unit_id: id }, 
            data
        });
        return new UnitEntity(
            units.unit_id,
            units.code,
            units.name,
            units.isused
        );
    }

    async changeUseState(id: number, state: UseState): Promise<UnitEntity> {
        const unit = await this.prisma.unit.update({
            where: { unit_id: id },
            data: { isused: state },
        });

        return new UnitEntity(
            unit.unit_id,
            unit.code,
            unit.name,
            unit.isused
        );
    }
}