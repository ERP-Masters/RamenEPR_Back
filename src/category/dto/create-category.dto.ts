import { IsNotEmpty, IsString, IsEnum, IsEmail, IsEmpty } from "class-validator";
import { CategoryGroup } from "@prisma/client";
import { Injectable } from "@nestjs/common";


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    group: CategoryGroup;

    @IsString()
    @IsNotEmpty()
    category_name: string; 
}