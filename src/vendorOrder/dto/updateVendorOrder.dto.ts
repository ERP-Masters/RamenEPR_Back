import { PartialType } from "@nestjs/mapped-types";
import { CreateVendorOrderDto } from "./createVendorOrder.dto";

export class UpdateVendorOrderDto extends PartialType(CreateVendorOrderDto) {}

