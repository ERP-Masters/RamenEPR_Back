import { IsString, IsInt, IsEnum, IsDate, IsNotEmpty } from "class-validator";
import { OrderStatus } from "@prisma/client";

export class CreateVendorOrderDto {
    @IsString()
    @IsNotEmpty()
    vendor_order_id: string;

    @IsInt()
    @IsNotEmpty()
    wh_id: number;

    @IsInt()
    @IsNotEmpty()
    vendor_id: number;

    @IsString()
    @IsNotEmpty()
    item_id: number;//외부 사용 ID

    @IsInt()
    @IsNotEmpty()
    quantity: number;

    @IsInt()
    received_quantity: number;

    @IsNotEmpty()
    @IsInt()
    unit_price: number;

    @IsNotEmpty()
    @IsInt()
    amount: number;

    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;
}