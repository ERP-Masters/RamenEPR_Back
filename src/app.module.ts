import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from "./database/prisma.module";
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [ PrismaModule, VendorModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
