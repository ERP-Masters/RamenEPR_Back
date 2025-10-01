import { Injectable, NotFoundException } from "@nestjs/common";
import { VendorRepository } from "./repository/vendor.repository";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { VendorEntity } from "./entities/vendor.entity";
import { UpdateVendorDto } from "./dto/update-vendor.dto";

@Injectable()
export class VendorService {
    //의존성 주입
    constructor(private readonly vendorRepository: VendorRepository) {}

    async create(dto: CreateVendorDto): Promise<VendorEntity> {
        return this.vendorRepository.create(dto);
    }

    async findAll(): Promise<VendorEntity[]> {
        return this.vendorRepository.findAll();
    }

    async findOne(id: number): Promise<VendorEntity> {
        const vendor = await this.vendorRepository.findOne(id);
        if (!vendor) throw new NotFoundException("Not found Vendor");
        else return vendor;
    }
    
    async update(id: number, dto: UpdateVendorDto): Promise<VendorEntity> {
        return this.vendorRepository.update(id, dto);
    }

    async remove(id: number): Promise<void> {
        return this.vendorRepository.remove(id);
    }
}