import { IsNotEmpty, IsInt, IsString, IsDate, IsEnum} from "class-validator";
import { OrderRequest, OrderStatus } from "@prisma/client";

export class CreateBranchRequestDto {
    @IsNotEmpty()
    @IsInt()
    branch_id: number;

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

    @IsString()
    request_note: string;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsNotEmpty()
    @IsDate()
    desired_due_date: Date;
}