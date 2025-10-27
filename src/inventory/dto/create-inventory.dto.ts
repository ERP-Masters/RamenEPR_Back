import { IsInt, IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { InventoryStatus } from "@prisma/client";

export class CreateInventoryDto {
    @IsInt()
    @IsNotEmpty()
    warehouse_id: number;

    @IsInt()
    @IsNotEmpty()
    item_id: number;

    @IsInt()
    @IsNotEmpty()
    quantity: number;

    @IsInt()
    @IsNotEmpty()
    safeft_stock: number;

    @IsDate()
    @IsNotEmpty()
    store_date: Date;

    @IsDate()
    @IsNotEmpty()
    expriy_date: Date;

    @IsEnum(InventoryStatus)
    status: InventoryStatus;
}