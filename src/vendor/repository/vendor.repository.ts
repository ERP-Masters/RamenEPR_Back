import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service"
import { VendorEntity } from "../entities/vendor.entity";
import { CreateVendorDto } from "../dto/create-vendor.dto";
import { UpdateItemDto } from "src/item/dto/update-item.dto";

@Injectable()
export class VendorRepository {
    constructor(private readonly prisma: PrismaService){ }

    //Create Vendor
    async create(data: CreateVendorDto): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.create({ data });
        return new VendorEntity(vendor.vendor_id, vendor.name, vendor.manager, vendor.contact, vendor.address);
    }
    
    //find All Vendor
    async findAll(): Promise<VendorEntity[]>{
        const vendors = await this.prisma.vendor.findMany();
        return vendors.map(
            v => new VendorEntity(v.vendor_id, v.name, v.manager, v.contact, v. address)
        );
    }

    //Find a specific vendor by ID.
    async findOne(id: number): Promise<VendorEntity | null> {
        const vendor = await this.prisma.vendor.findUnique({
            where: { vendor_id: id }
        });
        return vendor ? 
        new VendorEntity(vendor.vendor_id, vendor.name, vendor.manager, vendor.contact, vendor.address) : null;
    }

    //update vendor info.
    async update(id: number, data: UpdateItemDto): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({ 
            where: { vendor_id: id }, 
            data
        });
        return new VendorEntity(vendor.vendor_id, vendor.name, vendor.manager, vendor.contact, vendor.address);
    }

    //Remove specific vender
    async remove(id: number): Promise<void> {
        await this.prisma.vendor.delete({
             where: { 
                vendor_id: id 
            } 
        });
    }
}