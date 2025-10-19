import { IsNotEmpty, IsString, IsEnum, IsEmail, IsEmpty } from "class-validator";
import { CategoryGroup } from "@prisma/client";
import { UseState } from "@prisma/client";


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    group: CategoryGroup;

    @IsString()
    @IsNotEmpty()
    category_name: string; 

    @IsEnum(UseState)
    isused: UseState;
}