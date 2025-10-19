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

    //Create Vendor
    async create(data: CreateVendorDto): Promise<VendorEntity> {

        const vendor = await this.prisma.vendor.create({ data });
        return new VendorEntity(
            vendor.vendor_id, 
            vendor.name, 
            vendor.manager, 
            vendor.contact,
            vendor.isused,
            vendor.address
        );
    }
    
    //find All Vendor
    async findAll(): Promise<VendorEntity[]> {
        //SELECT * FROM vendor;
        const vendors = await this.prisma.vendor.findMany();
        return vendors.map(
            v => 
                new VendorEntity(
                    v.vendor_id, 
                    v.name, 
                    v.manager, 
                    v.contact,
                    v.isused,
                    v.address
                )
        );
    }

    async findNotUsedVendor(): Promise<VendorEntity[]> {
        const vendors = await this.prisma.vendor.findMany({
            where: { isused: UseState.NOTUSED }
        });

        return vendors.map(
            v => 
                new VendorEntity(
                    v.vendor_id, 
                    v.name, 
                    v.manager, 
                    v.contact,
                    v.isused,
                    v.address
                )
        );
    }

    async findIdAndName(): Promise<ResponseVendorDto[]> {
        return this.prisma.vendor.findMany({
            select: {
                vendor_id: true, name: true
            },
        })
    }

    //Find a specific vendor by ID.
    async findOne(id: number): Promise<VendorEntity | null> {
        const vendor = await this.prisma.vendor.findUnique({
            where: { vendor_id: id }
        });
        return vendor ? 
        new VendorEntity(
            vendor.vendor_id, 
            vendor.name, 
            vendor.manager, 
            vendor.contact,
            vendor.isused,
            vendor.address) : null;
    }

    //update vendor info.
    async update(id: number, data: UpdateItemDto): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({ 
            where: { vendor_id: id }, 
            data
        });
        return new VendorEntity(
            vendor.vendor_id, 
            vendor.name, 
            vendor.manager, 
            vendor.contact,
            vendor.isused,
            vendor.address
        );
    }

    //Remove specific vender
    async changeUseState(id: number, state: UseState): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({
            where: { vendor_id: id },
            data: { isused: state }
        });

        return new VendorEntity(
            vendor.vendor_id, 
            vendor.name, 
            vendor.manager, 
            vendor.contact,
            vendor.isused,
            vendor.address
        );
    }
}