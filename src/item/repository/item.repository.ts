import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";

import { PrismaService } from "src/database/prisma.service";
import { ItemEntity } from "../entities/item.entity";

@Injectable()
export class ItemRepository {
    constructor(private readonly prisma: PrismaService) { }

    private loadEntity(item: any): ItemEntity {
        return new ItemEntity(
            item.item_id,
            item.category_id,
            item.name,
            item.unit_id,
            item.vendor_id,
            item.unit_price,
            item.expiry_date,
        );
    }
    async create(data: CreateItemDto): Promise<ItemEntity> {
        const items = await this.prisma.item.create({
            data: {
                ...data,
                expiry_date: new Date(data.expiry_date),
            },
        });

        return this.loadEntity(items);
    }

    async findAll(): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany();
        
        return items.map(
            (I) => this.loadEntity(I)
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
    async update(id: string, data: UpdateItemDto): Promise<ItemEntity> {
        const items = await this.prisma.item.update({
            where: { item_id: id },
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
    async remove(id: string): Promise<void> {
        await this.prisma.item.delete({ 
            where: { item_id: id } 
        });
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