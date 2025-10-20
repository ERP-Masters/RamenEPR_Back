import { Prisma } from '@prisma/client';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class ResponseVendorDto {
    @IsInt()
    @IsNotEmpty()
    vendor_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

}