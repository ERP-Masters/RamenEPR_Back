import { Module ,forwardRef } from "@nestjs/common";
import { VendorOrderService } from "./vendorOrder.service";
import { VendorOrderController } from "./vendorOrder.controller";
import { VendorOrderRepository } from "./repository/vendorOrder.repository";
import { PrismaService } from "src/database/prisma.service";
import { InventoryModule } from 'src/inventory/inventory.module'; 
@Module({
    imports: [forwardRef(() => InventoryModule)],
    controllers: [VendorOrderController],
    providers: [VendorOrderService, VendorOrderRepository
        , PrismaService]
})
export class VendorOrderModule {}