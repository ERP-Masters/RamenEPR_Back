import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { BranchRepository } from './repository/branch.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [BranchController],
  providers: [BranchService, BranchRepository, PrismaService],
})
export class BranchModule {}