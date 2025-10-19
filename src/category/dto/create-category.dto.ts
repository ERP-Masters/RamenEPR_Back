import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { CategoryGroup, UseState } from "@prisma/client";


export class CreateCategoryDto {
    @IsEnum(CategoryGroup)
    @IsNotEmpty()
    group: CategoryGroup;

    @IsString()
    @IsNotEmpty()
    category_name: string;

    @IsEnum(UseState)
    isused: UseState;
}