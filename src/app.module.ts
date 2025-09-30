import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from "./database/prisma.module";
import { VendorModule } from './vendor/vendor.module';
import { CategoryModule } from './category/category.modules';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [ PrismaModule, VendorModule, CategoryModule,
    UnitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
