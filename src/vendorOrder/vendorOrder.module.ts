import { Module } from "@nestjs/common";
import { VendorOrderService } from "./vendorOrder.service";
import { VendorOrderController } from "./vendorOrder.controller";
import { VendorOrderRepository } from "./repository/vendorOrder.repository";
import { PrismaService } from "src/database/prisma.service";

@Module({
    controllers: [VendorOrderController],
    providers: [VendorOrderService, VendorOrderRepository
        , PrismaService]
})
export class ItemModule {}