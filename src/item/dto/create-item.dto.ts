import { IsString, IsInt, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { Unit } from '@prisma/client';

export class CreateItemDto { 
    @IsString()
    @IsNotEmpty()
    item_id: string;

    @IsString()
    @IsNotEmpty()
    category_id: number;
        
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    unit_id: number;

    @IsInt()
    @IsNotEmpty()
    unit_price: number;

    @IsDateString()
    @IsNotEmpty()
    expiry_date: string;

    @IsInt()
    @IsNotEmpty()
    vender_id: number;
}