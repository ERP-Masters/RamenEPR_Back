import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UnitEntity } from "../entities/unit.entity";
import { CreateUnitDto } from "../dto/create-unit.dto";
import { UpdateUnitDto } from "../dto/update-unit.dto";

@Injectable()
export class UnitRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUnitDto): Promise<UnitEntity> {
        const units = await this.prisma.unit.create({ data })
        return new UnitEntity(units.unit_id, units.code, units.name );
    }

    async findAll(): Promise<UnitEntity[]> {
        const units = await this.prisma.unit.findMany();
        return units.map(unit => new UnitEntity(unit.unit_id, unit.code, unit.name ));
    }

    async update(id: number, data: CreateUnitDto): Promise<UnitEntity> {
        const units = await this.prisma.unit.update({ where: {unit_id: id }, data})
        return new UnitEntity(units.unit_id, units.code, units.name );
    }

    async remove(id: number): Promise<void> {
        await this.prisma.unit.delete({ where: {unit_id: id} });
    }
}