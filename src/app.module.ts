import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from "./database/prisma.module";
import { VendorModule } from './vendor/vendor.module';
import { CategoryModule } from './category/category.modules';
import { UnitModule } from './unit/unit.module';
import { ItemModule } from './item/item.modules';
import { WarehouseModule } from './warehouse/warehouse.module';
import { BranchModule } from './branch/branch.module';
import { vendorOrderModule } from './vendorOrder/vendorOrder.module';


@Module({
  imports: [ PrismaModule, VendorModule, CategoryModule,
    UnitModule, ItemModule, WarehouseModule, BranchModule,
    vendorOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
