import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { BranchEntity } from "../entities/branch.entity";
import { CreateBranchDto } from "../dto/create-branch.dto";
import { UpdateBranchDto } from "../dto/update-branch.dto";

@Injectable()
export class BranchRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateBranchDto): Promise<BranchEntity> {
        const branchs = await this.prisma.branch.create({ data });
        return new BranchEntity(
            branchs.branch_id,
            branchs.name,
            branchs.location,
            branchs.detail_address,
            branchs.store_owner,
            branchs.contact,
        )
    }

    async findAll(): Promise<BranchEntity[]> {
        const branchs = await this.prisma.branch.findMany();
        return branchs.map(
            b => 
                new BranchEntity(
                    b.branch_id,
                    b.name,
                    b.location,
                    b.detail_address,
                    b.store_oner,
                    b.contact
                )
        );
    }
}