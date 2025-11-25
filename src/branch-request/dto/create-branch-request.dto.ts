import { IsNotEmpty, IsInt, IsString, IsDate, IsEnum, IsArray, ValidateNested } from "class-validator";
import { OrderRequest, OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";

export class CreateBranchRequestDto {
    @IsNotEmpty()
    @IsInt()
    branch_id: number;

    @IsString()
    request_note: string;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsNotEmpty()
    @IsDate()
    desired_due_date: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}

export class OrderItemDto {
    @IsNotEmpty()
    @IsInt()
    item_id: number;

    @IsNotEmpty()
    @IsInt()
    quantity: number;

    @IsNotEmpty()
    @IsInt()
    unit_price: number;

    @IsNotEmpty()
    @IsInt()
    amount: number;

}