import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { UnitService } from "./unit.service";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UseState } from "@prisma/client";

@Controller('units')
export class UnitController {
    constructor(private readonly unitService: UnitService) { }

    @Post()
    async create(@Body() dto: CreateUnitDto) {
        return this.unitService.create(dto);
    }

    @Get()
    async findAll() {
        return this.unitService.findAll();
    }

    @Get('state')
    async findNotUsedUnit() {
        return this.unitService.findNotUsedUnit();
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: CreateUnitDto) {
        return this.unitService.update(+id, dto);
    }

    @Put('changestate/:id')
    async changeUseState(
        @Param('id')
        id: string,
        @Body('state')
        state: UseState
    ) {
        return this.unitService.changeUseState(+id, state);
    }
    
}
