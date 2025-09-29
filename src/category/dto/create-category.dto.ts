import { IsNotEmpty, IsString, IsEnum, IsEmail, IsEmpty } from "class-validator";
import { Unit } from "@prisma/client";
import { Injectable } from "@nestjs/common";


export class CreateCategoryDto {
    @IsString()
    @IsEmpty()
    group: Unit;

    @IsString()
    @IsEmpty()
    category_name: string; 
}