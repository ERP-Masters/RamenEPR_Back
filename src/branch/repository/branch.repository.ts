import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { BranchEntity } from "../entities/branch.entity";
import { CreateBranchDto } from "../dto/create-branch.dto";
import { UpdateBranchDto } from "../dto/update-branch.dto";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Branch 생성
  async create(data: CreateBranchDto): Promise<BranchEntity> {
    const branch = await this.prisma.branch.create({ data });
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

  // 전체 조회
  async findAll(): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany();
    return branches.map(
      (b) =>
        new BranchEntity(
          b.branch_id,
          b.name,
          b.location,
          b.detail_address,
          b.store_owner,
          b.contact,
          b.created_at,
        ),
    );
  }

  // ID로 조회
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

  // 이름으로 조회
  async findByBName(bname: string): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { name: bname },
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
          b.created_at,
        ),
    );
  }

  // 위치나 상세주소로 조회
  async findByLocationOrDetail(loc: string): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: {
        OR: [
          { location: { contains: loc } },
          { detail_address: { contains: loc } },
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
          b.created_at,
        ),
    );
  }

  // 수정
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

  // 삭제
  async remove(id: number): Promise<void> {
    await this.prisma.branch.delete({
      where: { branch_id: id },
    });
  }
}