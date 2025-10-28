import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";

import { PrismaService } from "src/database/prisma.service";
import { ItemEntity } from "../entities/item.entity";
import { UseState } from "@prisma/client";


@Injectable()
export class ItemRepository {
    constructor(private readonly prisma: PrismaService) { }

    private readonly CATEGORY_CODE_MAP: Record<string, string> = {
        고기: "MEAT",
        해산물: "SEAFOOD",
        면류: "NOODLES",
        채소: "VEGETABLES",
        유제품: "DAIRY",
        가공품: "PROCESSED",
        소스: "SAUCES",
        시즈닝: "SEASONINGS",
        육수: "SOUPS",
        육수베이스: "BTROTH_BASE"
    }

    private readonly CATEGORY_CODE_RANGE: Record<string, [number, number]> = {
        MEAT: [0, 999],
        SEAFOOD: [1000, 1999],
        NOODLES: [2000, 2999],
        VEGETABLES: [3000, 3999],
        DAIRY: [4000, 4999],
        EGGS: [5000, 5999],
        PROCESSED: [6000, 6999],
        SAUCES: [7000, 7999],
        SEASONINGS: [8000, 8999],
        SOUPS: [9000, 9499],
        BROTH_BASE: [9500, 9999],
    };

    private loadEntity(item: any): ItemEntity {
        return new ItemEntity(
            item.id,
            item.item_id,
            item.category_id,
            item.name,
            item.unit_id,
            item.vendor_id,
            item.unit_price,
            item.expiry_date,
            item.isused
        );
    }

    private async generateItemId(categoryId: number): Promise<string> {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            select: { group: true },
        });

        if (!category) {
            throw new NotFoundException(`카테고리 ID ${categoryId}를 찾을 수 없습니다.`);
        }

        const [start, end] = this.CATEGORY_CODE_RANGE[category.group] || [];
        if (start === undefined)
            throw new Error(`카테고리 ${category.group}의 코드 범위가 정의되지 않았습니다.`);

        // 현재 카테고리 코드 중 가장 높은 item_id 찾기
        const lastItem = await this.prisma.item.findFirst({
            where: {
                item_id: {
                    gte: `IT_${start.toString().padStart(4, "0")}`,
                    lte: `IT_${end.toString().padStart(4, "0")}`,
                },
            },
            orderBy: { item_id: "desc" },
        });

        const nextNumber = lastItem
            ? parseInt(lastItem.item_id.replace("IT_", ""), 10) + 1
            : start;

        if (nextNumber > end)
            throw new Error(`카테고리 ${category.group}의 코드 범위를 초과했습니다.`);

        return `IT_${nextNumber.toString().padStart(4, "0")}`;
    }

    /** 품목 생성 (ERP 코드 자동 부여) */
  async create(data: CreateItemDto): Promise<ItemEntity> {
    const item_id = await this.generateItemId(data.category_id);

    const item = await this.prisma.item.create({
      data: {
        ...data,
        item_id,
        expiry_date: new Date(data.expiry_date),
      },
    });

    return this.loadEntity(item);
  }

    async findAll(): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany({
            where: { isused: UseState.USED }
        });

        return items.map(
            (I) => this.loadEntity(I)
        );
    }

    async findNotUsedItem(): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany({
            where: { isused: UseState.NOTUSED }
        })

        return items.map(
            (i) => this.loadEntity(i)
        );
    }

    //Item Id를 통한 조회
    async findOne(id: string): Promise<ItemEntity> {
        const items = await this.prisma.item.findUnique({
            where: {
                item_id: id
            }
        });

        return this.loadEntity(items);
    }

    //category_id로 조회
    async findItemByCategoryId(id: number): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany({
            where: {
                category_id: id
            }
        });

        return items.map(
            (I) => this.loadEntity(I)
        );
    }

    //거래처 기준으로 정렬
    async findItemByVendorId(id: number): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany({
            where: {
                vendor_id: id
            }
        });

        return items.map(
            (I) => this.loadEntity(I)
        );
    }

    //아이템 수정
    async update(id: number, data: UpdateItemDto): Promise<ItemEntity> {
        const items = await this.prisma.item.update({
            where: { id: id },
            data: {
                ...data,
                expiry_date: data.expiry_date
                    ? new Date(data.expiry_date)
                    : undefined,
            },
        });

        return this.loadEntity(items);
    }

    //아이템 삭제
    async changeUseState(id: number, state: UseState): Promise<ItemEntity> {
        const item = await this.prisma.item.update({
            where: { id: id },
            data: { isused: state },
        });

        return this.loadEntity(item);
    }

    async searchByName(keyword: string): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany({
            where: {
                name: {
                    contains: keyword
                }
            },
        });

        return items.map(
            (I) => this.loadEntity(I)
        );
    }

    //유통기한 만료일에 가까운 item 조회
    async findExpiringItems(days: number): Promise<ItemEntity[]> {
        const now = new Date();
        const threshold = new Date();
        threshold.setDate(now.getDate() + days);

        const items = await this.prisma.item.findMany({
            where: {
                expiry_date: { lte: threshold },
            },
        });

        return items.map(
            (I) => this.loadEntity(I)
        );
    }

}