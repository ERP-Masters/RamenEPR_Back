import { Module, forwardRef } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryRepository } from "./repository/inventory.repository";
import { PrismaService } from "src/database/prisma.service";
import { VendorOrderModule } from "src/vendorOrder/vendorOrder.module";

@Module({
  imports: [forwardRef(() => VendorOrderModule)],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository, PrismaService],
  exports: [InventoryService],
})
export class InventoryModule {}