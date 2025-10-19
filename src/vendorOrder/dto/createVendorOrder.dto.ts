import { IsString, IsInt, IsEnum, IsDate, IsNotEmpty } from "class-validator";
import { OrderStatus } from "@prisma/client";

export class CreateVendorOrderDto {
    @IsString()
    @IsNotEmpty()
    vendor_order_id: string;

    @IsInt()
    @IsNotEmpty()
    vendor_id: number;

    @IsString()
    @IsNotEmpty()
    item_id: string;//외부 사용 ID

    @IsInt()
    @IsNotEmpty()
    quantity: number;

    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;
}