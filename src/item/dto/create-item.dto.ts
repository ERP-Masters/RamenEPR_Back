import { IsString, IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateItemDto { 
    @IsInt()
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