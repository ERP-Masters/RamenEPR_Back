import { Module } from "@nestjs/common";
import { LotTraceController } from "./lot.controller";
import { LotTraceService } from "./lot.service";
import { LotTraceRepository } from "./repository/lot.repository";

@Module({
    controllers: [LotTraceController],
    providers: [LotTraceService, LotTraceRepository],
    exports: [LotTraceService],
})
export class LotTraceModule {}