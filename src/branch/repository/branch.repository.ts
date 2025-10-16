import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { BranchEntity } from "../entities/branch.entity";
import { CreateBranchDto } from "../dto/create-branch.dto";
import { UpdateBranchDto } from "../dto/update-branch.dto";
import { UseState } from "@prisma/client";
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateBranchDto): Promise<BranchEntity> {
    const branches = await this.prisma.branch.create({ data });
    return new BranchEntity(
      branches.branch_id,
      branches.name,
      branches.location,
      branches.detail_address,
      branches.store_owner,
      branches.contact,
      branches.isused,
      branches.created_at
    )
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
          b.isused,
          b.created_at,
        ),
    );
  }

  async notUsedBranch(): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { isused: UseState.NOTUSED },
      select: {
        branch_id: true,
        name: true,
        location: true,
        detail_address: true,
        store_owner: true,
        contact: true,
        isused: true,
        created_at: true,
      },
    })
    return branches.map(
      (b) =>
        new BranchEntity(
          b.branch_id,
          b.name,
          b.location,
          b.detail_address,
          b.store_owner,
          b.contact,
          b.isused,
          b.created_at,
        ),
    );
  }

  // ID로 조회
  async findById(id: number): Promise<BranchEntity | null> {
    const branches = await this.prisma.branch.findUnique({
      where: { branch_id: id },
    });
    return branches
      ? new BranchEntity(
        branches.branch_id,
        branches.name,
        branches.location,
        branches.detail_address,
        branches.store_owner,
        branches.contact,
        branches.isused,
        branches.created_at,
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
          b.isused,
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
          b.isused,
          b.created_at,
        ),
    );
  }

  // 수정
  async update(id: number, data: UpdateBranchDto): Promise<BranchEntity> {
    const branches = await this.prisma.branch.update({
      where: { branch_id: id },
      data,
    });
    return new BranchEntity(
      branches.branch_id,
      branches.name,
      branches.location,
      branches.detail_address,
      branches.store_owner,
      branches.contact,
      branches.isused,
      branches.created_at,
    );
  }

  // change state(USE, NOTUSE)
  async changeUseState(id: number, state: UseState): Promise<BranchEntity> {
    const branches = await this.prisma.branch.update({
      where: { branch_id: id },
      data: { isused: state },
    });

    return new BranchEntity(
      branches.branch_id,
      branches.name,
      branches.location,
      branches.detail_address,
      branches.store_owner,
      branches.contact,
      branches.isused,
      branches.created_at,
    );
  }
}