import { IsInt, IsString, IsDate, IsEnum } from "class-validator";
import { LotActionType } from "@prisma/client";

export class UpdateLotTraceDto { 
    @IsInt()
    id: number;

    @IsString()
    lot_id: string;

    @IsInt()
    item_id: number;

    @IsInt()
    warehouse_id: number;

    @IsInt()
    inventory_id: number;

    @IsDate()
    manufacture_date: Date

    @IsDate()
    expiry_date: Date;

    @IsDate()
    received_date: Date;

    @IsEnum(LotActionType)
    action_type: LotActionType;
}