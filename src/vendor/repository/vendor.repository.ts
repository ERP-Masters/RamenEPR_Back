import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service"
import { VendorEntity } from "../entities/vendor.entity";
import { CreateVendorDto } from "../dto/create-vendor.dto";
import { UpdateItemDto } from "src/item/dto/update-item.dto";
import { ResponseVendorDto } from "../dto/reponse-vendor.dto";
import { UseState } from "@prisma/client";
import { UpdateVendorDto } from "../dto/update-vendor.dto";

@Injectable()
export class VendorRepository {
    constructor(private readonly prisma: PrismaService) { }

    private readonly REGION_CODE_MAP: Record<string, string> = {
        서울: "SEOUL",
        부산: "BUSAN",
        대구: "DAEGU",
        인천: "INCHEON",
        광주: "GWANGJU",
        대전: "DAEJEON",
        울산: "ULSAN",
        세종: "SEJONG",
        경기: "GYEONGGI",
        강원: "GANGWON",
        충북: "CHUNGBUK",
        충남: "CHUNGNAM",
        전북: "JEONBUK",
        전남: "JEONNAM",
        경북: "GYEONGBUK",
        경남: "GYEONGNAM",
        제주: "JEJU",
    };


    private loadEntity(vendor: any): VendorEntity {
        return new VendorEntity(
            vendor.id,
            vendor.vendor_id,
            vendor.name,
            vendor.manager,
            vendor.contact,
            vendor.isused,
            vendor.address
        );
    }

    private async generateVendorId(address: string): Promise<string> {
        let regionCode = "ETC";

        for (const key of Object.keys(this.REGION_CODE_MAP)) {
            if (address.includes(key)) {
                regionCode = this.REGION_CODE_MAP[key];
                break;
            }
        }

        // 같은 지역 내에서 몇 번째 지점인지 계산
        const count = await this.prisma.vendor.count({
            where: { vendor_id: { startsWith: `VD_${regionCode}_` } },
        });

        return `VD_${regionCode}_${(count + 1).toString().padStart(4, "0")}`;
    }

    /** 거래처 생성 */
    async create(data: CreateVendorDto): Promise<VendorEntity> {
        const vendor_id = await this.generateVendorId(data.address);

        const vendor = await this.prisma.vendor.create({
            data: {
                ...data,
                vendor_id,
                isused: data.isused ?? UseState.USED,
            },
        });

        return this.loadEntity(vendor);
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
            select: { vendor_id: true, name: true },
        });
    }

    //Find a specific vendor by ID.
    async findOne(id: string): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.findUnique({
            where: { vendor_id: id }
        });

        return this.loadEntity(vendor);
    }

    //update vendor info.
    async update(id: number, data: UpdateVendorDto): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({
            where: { id: id },
            data
        });

        return this.loadEntity(vendor);
    }

    //Remove specific vender
    async changeUseState(id: number, state: UseState): Promise<VendorEntity> {
        const vendor = await this.prisma.vendor.update({
            where: { id: id },
            data: { isused: state }
        });

        return this.loadEntity(vendor);
    }
}