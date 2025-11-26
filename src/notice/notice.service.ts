import { Injectable } from "@nestjs/common";
import { NoticeRepository } from "./repository/notice.repository";
import { CreateNoticeDto } from "./dto/create-notice.dto";
import { UpdateNoticeDto } from "./dto/update-notice.dto";

@Injectable()
export class NoticeService {
  constructor(private readonly repo: NoticeRepository) {}

  async create(dto: CreateNoticeDto) {
    return this.repo.create(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    return this.repo.findById(id);
  }

  async update(id: number, dto: UpdateNoticeDto) {
    return this.repo.update(id, dto);
  }

  async remove(id: number) {
    return this.repo.remove(id);
  }
}
