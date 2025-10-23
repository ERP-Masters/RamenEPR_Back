import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UnitEntity } from "../entities/unit.entity";
import { CreateUnitDto } from "../dto/create-unit.dto";
import { UseState } from "@prisma/client";


@Injectable()
export class UnitRepository {
    constructor(private readonly prisma: PrismaService) { }

    private loadEntity(unit: any): UnitEntity {
        return new UnitEntity(
            unit.id,
            unit.unit_id,
            unit.code,
            unit.name,
            unit.isused
        );
    }


    private async generateUnitId(): Promise<string> {
        const count = await this.prisma.unit.count();
        return `UNIT_${(count + 1).toString().padStart(4, "0")}`;
    }

    /** 단위 생성 (ERP 코드 자동 부여 포함) */
    async create(data: CreateUnitDto): Promise<UnitEntity> {
        const unit_id = await this.generateUnitId();

        const unit = await this.prisma.unit.create({
            data: {
                ...data,
                unit_id,
                isused: data.isused ?? UseState.USED, // 기본값 설정
            },
        });

        return this.loadEntity(unit);
    }

    async findAll(): Promise<UnitEntity[]> {
        const units = await this.prisma.unit.findMany({
            where: { isused: UseState.USED },
        });

        return units.map(
            (u) => this.loadEntity(u)
        );
    }

    async findNotUsedUnit(): Promise<UnitEntity[]> {
        const units = await this.prisma.unit.findMany({
            where: { isused: UseState.NOTUSED }
        });

        return units.map(
            (u) => this.loadEntity(u)
        );
    }

    async update(id: number, data: CreateUnitDto): Promise<UnitEntity> {
        const units = await this.prisma.unit.update({
            where: { id: id },
            data
        });

        return this.loadEntity(units);
    }

    async changeUseState(id: number, state: UseState): Promise<UnitEntity> {
        const unit = await this.prisma.unit.update({
            where: { id: id },
            data: { isused: state },
        });

        return this.loadEntity(unit);
    }
}