import { IsString, IsEmail } from 'class-validator';

export class CreateVendorDto {

    @IsString()
    vendor_name: string;

    @IsString()
    manager: string;

    @IsEmail()
    contact: string;

    @IsString()
    address: string;
}