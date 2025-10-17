import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { UseState } from "@prisma/client";

export class CreateWarehouseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    location: string; 

    @IsEnum(UseState)
    isused: UseState;
}