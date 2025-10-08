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
            branchs.created_at
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
                    b.store_owner,
                    b.contact,
                    b.created_at
                )
        );
    }
    async findByBName(bname: string): Promise<BranchEntity[]> {
        const branches = await this.prisma.branch.findMany({
            where: {
                name: bname,   // ✅ 세미콜론 제거
            },
        });
        return branches.map(
            (b) =>
                new BranchEntity(
                    b.branch_id,
                    b.name,
                    b.location,
                    b.detail_address,
                    b.store_owner,
                    b.contact,
                    b.created_at
                ),
        );
    }

    async findByLocationOrDetail(loc: string): Promise<BranchEntity[]> {
        const branches = await this.prisma.branch.findMany({
            where: {
                OR: [
                    { location: { contains: loc } },        // 위치 포함 검색
                    { detail_address: { contains: loc } },  // 상세 주소 포함 검색
                ],
            },
        });

        return branches.map(
            (b) =>
                new BranchEntity(
                    b.branch_id,
                    b.name,
                    b.location,
                    b.detail_address,
                    b.store_owner,
                    b.contact,
                    b.created_at
                ),
        );
    }
    async findById(id: number): Promise<BranchEntity | null> {
        const branch = await this.prisma.branch.findUnique({
            where: { branch_id: id },
        });
        return branch
            ? new BranchEntity(
                branch.branch_id,
                branch.name,
                branch.location,
                branch.detail_address,
                branch.store_owner,
                branch.contact,
                branch.created_at,
            )
            : null;
    }

    async update(id: number, data: UpdateBranchDto): Promise<BranchEntity> {
        const branch = await this.prisma.branch.update({
            where: { branch_id: id },
            data,
        });
        return new BranchEntity(
            branch.branch_id,
            branch.name,
            branch.location,
            branch.detail_address,
            branch.store_owner,
            branch.contact,
            branch.created_at,
        );
    }

    async remove(id: number): Promise<void> {
        await this.prisma.branch.delete({ where: { branch_id: id } });
    }
}