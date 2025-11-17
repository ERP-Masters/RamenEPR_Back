import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { BranchRequestRepository } from "./repository/branch-request.repository";
import { BranchRequestService } from "./branch-request.service";
import { BranchRequestController } from "./branch-request.controller";

@Module({
  controllers: [BranchRequestController],
  providers: [
    PrismaService,
    BranchRequestRepository,
    BranchRequestService,
  ],
})
export class BranchRequestModule {}