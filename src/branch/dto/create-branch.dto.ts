import { IsString, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { Transform } from "class-transformer";

export class CreateBranchDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    detail_address: string;

    @IsString()
    @IsNotEmpty()
    store_owner: string;

    @IsString()
    @Transform(({ value }) => value.replace(/-/g, ''))
    @IsPhoneNumber('KR')
    @IsNotEmpty()
    contact: string;
}

