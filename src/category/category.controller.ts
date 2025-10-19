import { Controller, Get, Post, Put, Param, Body } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";  
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UseState } from "@prisma/client";

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

    @Get('state')
    async findNotUsedCategory() {
        return this.categoryService.findNotUsedCategory();
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto:UpdateCategoryDto){
        return this.categoryService.update(+id, dto);
    }

    @Put('changestate/:id')
    async changeUseState(
        @Param('id') 
        id: string,
        @Body('state')
        state: UseState
    ) {
        return this.categoryService.changeUseState(+id, state);
    }

}