import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { ItemService } from "./item.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";

@Controller("items")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // CREATE
  @Post()
  async create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  // READ - 전체 조회 or 카테고리/거래처 필터링
  @Get()
  async findAll(
    @Query("category") categoryId?: string,
    @Query("vendor") vendorId?: string,
    @Query("search") keyword?: string,
  ) {
    if (categoryId) {
      return this.itemService.findByCategoryId(+categoryId);
    }
    if (vendorId) {
      return this.itemService.findByVendorId(+vendorId);
    }
    if (keyword) {
      return this.itemService.searchByName(keyword);
    }
    return this.itemService.findAll();
  }

  // READ - 단건 조회
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.itemService.findOne(id);
  }

  // UPDATE
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateItemDto) {
    return this.itemService.update(id, dto);
  }

  // DELETE
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.itemService.remove(id);
  }

  // 유통기한 임박 품목 조회
  @Get("expiring/:days")
  async findExpiringItems(@Param("days") days: string) {
    return this.itemService.findExpiringItems(+days);
  }
}