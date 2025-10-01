import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { VendorRepository } from './repository/vendor.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [VendorController],
  providers: [VendorService, VendorRepository, PrismaService],
})
export class VendorModule {}