import { IsString, IsInt, IsEnum, IsDateString } from 'class-validator';
import { Unit } from '@prisma/client';

export class CreateItemDto { 
    @IsString()
    item_id: string;

    @IsString()
    category_id: number;
        
    @IsString()
    name: string;

    @IsEnum(Unit)
    unit: Unit;

    @IsInt()
    unit_price: number;

    @IsDateString()
    expiry_date: string;

    @IsInt()
    vender_id: number;
}