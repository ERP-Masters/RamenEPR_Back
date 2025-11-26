import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { NoticeEntity } from "../entities/notice.entity";
import { CreateNoticeDto } from "../dto/create-notice.dto";
import { UpdateNoticeDto } from "../dto/update-notice.dto";

@Injectable()
export class NoticeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private loadEntity(row: any): NoticeEntity {
    return new NoticeEntity(
      row.id,
      row.title,
      row.content,
      row.author_id,
      row.is_pinned,
      row.created_at,
      row.updated_at,
    );
  }

  async create(data: CreateNoticeDto): Promise<NoticeEntity> {
    const row = await this.prisma.notice.create({ data });
    return this.loadEntity(row);
  }

  async findAll(): Promise<NoticeEntity[]> {
    const rows = await this.prisma.notice.findMany({
      orderBy: [
        { is_pinned: "desc" }, // 상단 고정 먼저
        { created_at: "desc" },
      ],
    });
    return rows.map((r) => this.loadEntity(r));
  }

  async findById(id: number): Promise<NoticeEntity> {
    const row = await this.prisma.notice.findUnique({ where: { id } });
    if (!row) throw new NotFoundException(`공지 ${id} not found`);
    return this.loadEntity(row);
  }

  async update(id: number, data: UpdateNoticeDto): Promise<NoticeEntity> {
    const row = await this.prisma.notice.update({ where: { id }, data });
    return this.loadEntity(row);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.notice.delete({ where: { id } });
  }
}
