import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service"
import { VendorEntity } from "../entities/vendor.entity";
import { CreateVendorDto } from "../dto/create-vendor.dto";
import { UpdateItemDto } from "src/item/dto/update-item.dto";
import { ResponseVendorDto } from "../dto/reponse-vendor.dto";
import { UseState } from "@prisma/client";

@Injectable()
export class VendorRepository {
    constructor(private readonly prisma: PrismaService){ }

    private loadEntity(vendor: any): VendorEntity {
        return new VendorEntity(
            vendor.vendor_id, 
            vendor.name, 
            vendor.manager, 
            vendor.contact,
            vendor.isused,
            vendor.address
        );
    }

    //Create Vendor
    async create(data: CreateVendorDto): Promise<VendorEntity> {
        const vendors = await this.prisma.vendor.create({ data });
        
        return this.loadEntity(vendors);
    }
    
    //find All Vendor
    async findAll(): Promise<VendorEntity[]> {
        const vendors = await this.prisma.vendor.findMany();
        
        return vendors.map(
            (v) => this.loadEntity(v)
        );
    }

    async findNotUsedVendor(): Promise<VendorEntity[]> {
        const vendors = await this.prisma.vendor.findMany({
            where: { isused: UseState.NOTUSED }
        });

        return vendors.map(
            (v) => this.loadEntity(v)
        );
    }

    async findIdAndName(): Promise<ResponseVendorDto[]> {
        return this.prisma.vendor.findMany({
            select: {
                vendor_id: true, name: true
            },
        });
    }

    //Find a specific vendor by ID.
    async findOne(id: number): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.findUnique({
            where: { vendor_id: id }
        });
    
        return this.loadEntity(vendor);
    }

    //update vendor info.
    async update(id: number, data: UpdateItemDto): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({ 
            where: { vendor_id: id }, 
            data
        });

        return this.loadEntity(vendor);
    }

    //Remove specific vender
    async changeUseState(id: number, state: UseState): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({
            where: { vendor_id: id },
            data: { isused: state }
        });

        return this.loadEntity(vendor);
    }
}