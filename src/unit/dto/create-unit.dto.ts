import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UseState } from '@prisma/client';

export class CreateUnitDto { 
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(UseState)
    isused: UseState;
}