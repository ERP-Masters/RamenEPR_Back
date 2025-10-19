import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UseState } from '@prisma/client';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  // 창고 생성
  @Post()
  async create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  // 모든 창고 조회
  @Get()
  async findAll() {
    return this.warehouseService.findAll();
  }
  //미사용 창고 조회
  @Get('state')
  async findNotUsedWh() {
    return this.warehouseService.findNotUsedWh();
  }

  // 특정 창고 ID 조회
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.warehouseService.findByWarehouseId(+id);
  }

  // 특정 위치로 창고 조회
  @Get('location/:loc')
  async findByLocation(@Param('loc') loc: string) {
    return this.warehouseService.findByLocation(loc);
  }

  // 창고 정보 수정
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateWarehouseDto) {
    return this.warehouseService.update(+id, dto);
  }

  // 창고 삭제
  @Put('changestate/:id')
  async changeUseState(
    @Param('id')
    id: string,
    @Body('state')
    state: UseState
  ) {
    return this.warehouseService.changeUseState(+id, state);
  }
}