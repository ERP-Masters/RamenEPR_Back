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
import { UseState } from "@prisma/client";

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

  @Get('state')
  async findNotUsedItem() {
    return this.itemService.findNotUsedItem();
  }

  // READ - 단건 조회
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.itemService.findOne(id);
  }

  // UPDATE
  @Put(":id")
  async update(@Param("id") id: number, @Body() dto: UpdateItemDto) {
    return this.itemService.update(id, dto);
  }

  // change State
  @Put('changestate/:id')
  async changeUseState(
    @Param('id')
    id: number,
    @Body('state')
    state: UseState
  ) {
    return this.itemService.changeUseState(+id, state);
  }


  // 유통기한 임박 품목 조회
  @Get("expiring/:days")
  async findExpiringItems(@Param("days") days: string) {
    return this.itemService.findExpiringItems(+days);
  }
}