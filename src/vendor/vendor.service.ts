import { Injectable, NotFoundException } from "@nestjs/common";
import { VendorRepository } from "./repository/vendor.repository";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { VendorEntity } from "./entities/vendor.entity";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { ResponseVendorDto } from "./dto/reponse-vendor.dto";
import { UseState } from "@prisma/client";

@Injectable()
export class VendorService {
    //의존성 주입
    constructor(private readonly vendorRepository: VendorRepository) { }

    async create(dto: CreateVendorDto): Promise<VendorEntity> {
        return this.vendorRepository.create(dto);
    }

    async findAll(): Promise<VendorEntity[]> {
        return this.vendorRepository.findAll();
    }

    async findNotUsedVenor(): Promise<VendorEntity[]> {
        return this.vendorRepository.findNotUsedVendor();
    }

    async findIdAndName(): Promise<ResponseVendorDto[]> {
        return this.vendorRepository.findIdAndName();
    }

    async findOne(id: string): Promise<VendorEntity> {
        const vendor = await this.vendorRepository.findOne(id);
        if (!vendor) throw new NotFoundException("Not found Vendor");
        else return vendor;
    }

    async update(id: number, dto: UpdateVendorDto): Promise<VendorEntity> {
        return this.vendorRepository.update(id, dto);
    }

    async changeUseState(id: number, state: UseState): 
        Promise<{ message: string; vendor: VendorEntity }> {
           const updated = await this.vendorRepository.changeUseState(id, state);
        return {
            message: `거래처 ${id}의 상태가 ${state}로 변경되었습니다.`,
            vendor: updated,
        }  
    }
}