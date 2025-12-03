import { Module } from "@nestjs/common";
import { NoticeRepository } from "./repository/notice.repository";
import { NoticeService } from "./notice.service";
import { NoticeController } from "./notice.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [NoticeController],
  providers: [NoticeRepository, NoticeService, PrismaService],
})
export class NoticeModule {}
