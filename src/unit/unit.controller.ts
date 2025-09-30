import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { UnitService } from "./unit.service";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";

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

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: CreateUnitDto) {
        return this.unitService.update(+id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.unitService.remove(+id);
    }
}
