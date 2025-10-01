import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryRepository  } from "./repository/category.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
    constructor(private readonly CategoryRepository: CategoryRepository) {}

    async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
        return this.CategoryRepository.create(dto);
    }

    async findAll(): Promise<CategoryEntity[]> {
        return this.CategoryRepository.findAll();
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<CategoryEntity> {
        return this.CategoryRepository.update(id, dto);
    }

    async remove(id: number): Promise<void>{
        return this.CategoryRepository.remove(id);
    }
}