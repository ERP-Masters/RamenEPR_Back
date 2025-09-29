import { Prisma } from '@prisma/client';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateVendorDto implements Prisma.VendorCreateInput {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    manager: string;

    @IsEmail()
    @IsNotEmpty()
    contact: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}