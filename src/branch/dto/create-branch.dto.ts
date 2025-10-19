import { IsString, IsNotEmpty, IsPhoneNumber, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { UseState } from "@prisma/client";

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

    @IsEnum(UseState)
    @IsNotEmpty()
    isused: UseState;
}

