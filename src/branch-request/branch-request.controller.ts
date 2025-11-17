import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { BranchRequestService } from "./branch-request.service";
import { CreateBranchRequestDto } from "./dto/create-branch-request.dto";
import { UpdateBranchRequestDto } from "./dto/update-branch-request.dto";
import { OrderStatus } from "@prisma/client";

@Controller("branch-order")
export class BranchRequestController {
  constructor(private readonly service: BranchRequestService) {}

  @Post()
  async create(@Body() dto: CreateBranchRequestDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  /** 기간별 조회 */
  @Get("period")
  async findByPeriod(
    @Query("start") start: string,
    @Query("end") end: string,
  ) {
    const s = new Date(start);
    const e = new Date(end);

    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      throw new BadRequestException(
        "날짜 형식이 잘못되었습니다. YYYY-MM-DD 형식 사용",
      );
    }

    return await this.service.findByPeriod(s, e);
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.service.findById(+id);
  }

  /** 지점 ID 조회 */
  @Get("branch/:branchId")
  async findByBranch(@Param("branchId") branchId: string) {
    return await this.service.findByBranch(+branchId);
  }

  /** 지점 이름 조회 */
  @Get("branch/name/:name")
  async findByBranchName(@Param("name") name: string) {
    return await this.service.findByBranchName(name);
  }

  /** 상태별 조회 */
  @Get("status/:status")
  async findByStatus(@Param("status") status: OrderStatus) {
    return await this.service.findByStatus(status);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateBranchRequestDto,
  ) {
    return await this.service.update(+id, dto);
  }

  @Patch(":id/cancel")
  async cancel(@Param("id") id: string) {
    return await this.service.cancel(+id);
  }
}