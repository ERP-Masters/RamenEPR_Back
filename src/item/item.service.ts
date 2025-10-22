import { Injectable, NotFoundException } from "@nestjs/common";
import { ItemRepository } from "./repository/item.repository";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { ItemEntity } from "./entities/item.entity";
import { UseState } from "@prisma/client";

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  // CREATE
  async create(dto: CreateItemDto): Promise<ItemEntity> {
    return this.itemRepository.create(dto);
  }

  // READ - 전체 조회
  async findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.findAll();
  }

  // READ - 단건 조회
  async findOne(id: string): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne(id);
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  async findNotUsedItem(): Promise<ItemEntity[]> {
    return this.itemRepository.findNotUsedItem();
  }

  // UPDATE
  async update(id: number, dto: UpdateItemDto): Promise<ItemEntity> {
    // 존재 확인
    const existing = await this.itemRepository.update(id,dto);
    if (!existing) throw new NotFoundException(`Item with id ${id} not found`);
    return this.itemRepository.update(id, dto);
  }

  // change State
  async changeUseState(id: number, state: UseState):
    Promise<{ message: string; item: ItemEntity }> {
        const updated = await this.itemRepository.changeUseState(id, state);
    return {
      message: "지점 ${id}의 상태가 ${state}로 변경되었습니다.",
      item: updated,
    };
  }

  // 카테고리별 조회
  async findByCategoryId(categoryId: number): Promise<ItemEntity[]> {
    return this.itemRepository.findItemByCategoryId(categoryId);
  }

  // 거래처별 조회
  async findByVendorId(vendorId: number): Promise<ItemEntity[]> {
    return this.itemRepository.findItemByVendorId(vendorId);
  }

  // 이름 검색
  async searchByName(keyword: string): Promise<ItemEntity[]> {
    return this.itemRepository.searchByName(keyword);
  }

  // 유통기한 임박 아이템 조회
  async findExpiringItems(days: number): Promise<ItemEntity[]> {
    return this.itemRepository.findExpiringItems(days);
  }
}