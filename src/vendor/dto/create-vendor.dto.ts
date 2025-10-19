import { Prisma, UseState } from '@prisma/client';
import { IsString, IsEmail, IsNotEmpty, IsEnum} from 'class-validator';

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

    @IsEnum(UseState)
    @IsNotEmpty()
    isused: UseState;
}