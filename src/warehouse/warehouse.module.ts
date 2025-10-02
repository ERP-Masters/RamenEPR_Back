import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from './repository/warehouse.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, WarehouseRepository, PrismaService],
})
export class WarehouseModule {}