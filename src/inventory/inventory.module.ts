import { Module, forwardRef } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryRepository } from "./repository/inventory.repository";
import { PrismaService } from "src/database/prisma.service";
import { vendorOrderModule } from "src/vendorOrder/vendorOrder.module";

@Module({
  imports: [forwardRef(() => vendorOrderModule)],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository, PrismaService],
  exports: [InventoryService],
})
export class InventoryModule {}