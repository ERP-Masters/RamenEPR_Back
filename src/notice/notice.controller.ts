import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { NoticeService } from "./notice.service";
import { CreateNoticeDto } from "./dto/create-notice.dto";
import { UpdateNoticeDto } from "./dto/update-notice.dto";

@Controller("notice")
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Post()
  create(@Body() dto: CreateNoticeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.service.findById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateNoticeDto) {
    return this.service.update(+id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
