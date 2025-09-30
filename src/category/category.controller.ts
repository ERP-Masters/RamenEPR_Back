import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";  
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {} 
    
    @Post()
    async create(@Body() dto: CreateCategoryDto) {  
        return this.categoryService.create(dto);
    }

    @Get()
    async findAll(){
        return this.categoryService.findAll();
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto:UpdateCategoryDto){
        return this.categoryService.update(+id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoryService.remove(+id);
    }

}