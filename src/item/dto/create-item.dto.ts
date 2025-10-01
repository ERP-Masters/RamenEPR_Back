import { IsString, IsInt, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateItemDto { 
    @IsString()
    @IsNotEmpty()
    item_id: string; //내부 아이디, ITEM_001 같은 의미

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
    vendor_id: number;
}