import { Prisma } from '@prisma/client';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class ResponseVendorDto {
    @IsInt()
    @IsNotEmpty()
    vendor_id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}