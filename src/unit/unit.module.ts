import { Module } from "@nestjs/common";
import { UnitService } from "./unit.service";
import { UnitController } from "./unit.controller";
import { UnitRepository } from "./unit.repository";
import { PrismaService } from "src/database/prisma.service";

@Module({
    controllers: [UnitController],
    providers: [UnitService, UnitRepository, PrismaService],
})

export class UnitModule {}
