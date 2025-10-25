import { Prisma, UseState } from '@prisma/client';
import { IsString, IsEmail, IsNotEmpty, IsEnum} from 'class-validator';

export class CreateVendorDto {
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

    @IsString()
    @IsNotEmpty()
    identification_number: string;

    @IsEnum(UseState)
    isused: UseState;
}