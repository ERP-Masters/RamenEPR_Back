import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CategoryEntity } from "../entities/category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { UseState } from "@prisma/client";

@Injectable()
export class CategoryRepository {
    //prisma Service 의존성 주입
    constructor(private readonly prisma: PrismaService) {}

    private loadEntity(category: any): CategoryEntity {
        return new CategoryEntity(
            category.category_id, 
            category.group , 
            category.category_name,
            category.isused,
        );
    }

    //카테고리 생성
    async create(data: CreateCategoryDto ): Promise<CategoryEntity> {
        const category = await this.prisma.category.create({ data });
        return this.loadEntity(category);
    }

    //카테고리 조회
    async findAll(): Promise<CategoryEntity[]> {
        const category = await this.prisma.category.findMany();
        return category.map(
            (c) => this.loadEntity(c)
        );
    }

    async findNotUsedCategory(): Promise<CategoryEntity[]> {
        const category = await this.prisma.category.findMany({
            where: { isused: UseState.NOTUSED }
        });

        if (!category.length) {
            throw new NotFoundException('현재 사용되지 않는 카테고리가 없습니다. ');
        }

        return category.map(
            (c) => this.loadEntity(c)
        );

    }
    
    //카레고리 수정
    async update(id: number, data: UpdateCategoryDto): Promise<CategoryEntity> {
        const category = await this.prisma.category.update({ 
            where: { 
                category_id: id 
            }, 
            data
        });
        
        return this.loadEntity(category);
    }

    async changeUseState(id: number, state: UseState): Promise<CategoryEntity> {
        const category = await this.prisma.category.update({ 
            where: {
                    category_id: id 
            },
            data: {
                isused: state
            },
        });

        return this.loadEntity(category);
    }

}