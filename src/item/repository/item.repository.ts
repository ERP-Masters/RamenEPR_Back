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
            select: { group: true, category_name: true },
        });

        if (!category) {
            throw new NotFoundException(`카테고리 ID ${categoryId}를 찾을 수 없습니다.`);
        }

        const categoryCode = category.group ?? "ETC";

        const count = await this.prisma.item.count({
            where: { category_id: categoryId },
        });

        return `IT_${categoryCode}_${(count + 1).toString().padStart(4, "0")}`;
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