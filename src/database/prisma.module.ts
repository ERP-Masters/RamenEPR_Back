import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ✅ 전역으로 등록해서 import 안 해도 됨
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}