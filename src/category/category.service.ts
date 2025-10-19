import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryRepository  } from "./repository/category.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UseState } from "@prisma/client";

@Injectable()
export class CategoryService {
    constructor(private readonly CategoryRepository: CategoryRepository) {}

    async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.CategoryRepository.create(dto);
    }

    async findAll(): Promise<CategoryEntity[]> {
        return this.CategoryRepository.findAll();
    }

    async findNotUsedCategory(): Promise<CategoryEntity[]> {
        return this.CategoryRepository.findNotUsedCategory();
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity> {
        return this.CategoryRepository.update(id, dto);
    }

    async changeUseState(id: number, state: UseState):
        Promise<{ message: string; category: CategoryEntity }>{
            const updated = await this.CategoryRepository.changeUseState(
                id, state
            );
        return {
            message: "카테고리 ${id}의 상태가 ${state}로 변경되었습니다.",
            category: updated,
        }
    }
}