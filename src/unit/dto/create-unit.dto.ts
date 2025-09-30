import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateUnitDto { 


    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}