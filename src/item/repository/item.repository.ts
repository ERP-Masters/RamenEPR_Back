import { Injectable } from "@nestjs/common";
import { ItemService } from "../item.service";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";

import { PrismaService } from "src/database/prisma.service";
import { ItemEntity } from "../entities/item.entity";

@Injectable()
export class ItemRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateItemDto): Promise<ItemEntity> {
        const items = await this.prisma.item.create({
            data: {
                ...data,
                expiry_date: new Date(data.expiry_date),
            },
        });

        return new ItemEntity(
            items.item_id,
            items.category_id,
            items.name,
            items.unit_id,
            items.vendor_id,
            items.unit_price,
            items.expiry_date,
        );
    }

    async findAll(): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany();
        return items.map(
            I =>
                new ItemEntity(
                    I.item_id,
                    I.category_id,
                    I.name,
                    I.unit_id,
                    I.vendor_id,
                    I.unit_price,
                    I.expiry_date,
                )
        )
    }

    //Item Id를 통한 조회
    async findOne(id: string): Promise<ItemEntity | null> {
        const items = await this.prisma.item.findUnique({
            where: {
                item_id: id
            }
        });
        return items ?
            new ItemEntity(
                items.item_id,
                items.category_id,
                items.name,
                items.unit_id,
                items.vendor_id,
                items.unit_price,
                items.expiry_date,
            ) : null;
    }
    //category_id로 조회
    async findItemByCategoryId(id: number): Promise<ItemEntity[]> {
        const items = await this.prisma.item.findMany({
            where: {
                category_id: id
            }
        });

        return items.map(
            (I) =>
                new ItemEntity(
                    I.item_id,
                    I.category_id,
                    I.name,
                    I.unit_id,
                    I.vendor_id,
                    I.unit_price,
                    I.expiry_date,
                )
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
            (I) =>
                new ItemEntity(
                    I.item_id,
                    I.category_id,
                    I.name,
                    I.unit_id,
                    I.vendor_id,
                    I.unit_price,
                    I.expiry_date,
                )
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

        return new ItemEntity(
            items.item_id,
            items.category_id,
            items.name,
            items.unit_id,
            items.vendor_id,
            items.unit_price,
            items.expiry_date,
        );
    }

    //아이템 삭제
    async remove(id: string): Promise<void> {
        await this.prisma.item.delete({ where: { item_id: id } });
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
            (I) =>
                new ItemEntity(
                    I.item_id,
                    I.category_id,
                    I.name,
                    I.unit_id,
                    I.vendor_id,
                    I.unit_price,
                    I.expiry_date,
                )
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
            (I) =>
                new ItemEntity(
                    I.item_id,
                    I.category_id,
                    I.name,
                    I.unit_id,
                    I.vendor_id,
                    I.unit_price,
                    I.expiry_date,
                )
        );
    }

}