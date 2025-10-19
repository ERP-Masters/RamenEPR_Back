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

  private loadEntity(branch: any): BranchEntity {
    return new BranchEntity(
      branch.branch_id,
      branch.name,
      branch.location,
      branch.detail_address,
      branch.store_owner,
      branch.contact,
      branch.isused,
      branch.created_at
    )
  }

  async create(data: CreateBranchDto): Promise<BranchEntity> {
    const branches = await this.prisma.branch.create({ data });
    return this.loadEntity(branches);
  }

  // 전체 조회
  async findAll(): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany();
        
    if (!branches.length) {
      throw new NotFoundException('현재 등록된 지점이 없습니다.');
    }
    
    return branches.map(
      (b) => this.loadEntity(b)
    );
  }

  async notUsedBranch(): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { isused: UseState.NOTUSED },
    });

    if (!branches.length) {
      throw new NotFoundException('현재 사용되지 않는 지점이 없습니다.');
    }

    return branches.map(
      (b) => this.loadEntity(b)
    );
  }

  // ID로 조회
  async findById(id: number): Promise<BranchEntity> {
    const branches = await this.prisma.branch.findUnique({
      where: { branch_id: id },
    });

    if (!branches) {
      throw new NotFoundException(`ID ${id}번 지점을 찾을 수 없습니다.`);
    }

    return this.loadEntity(branches);
  }

  // 이름으로 조회
  async findByBName(bname: string): Promise<BranchEntity[]> {
    const branches = await this.prisma.branch.findMany({
      where: { name: bname },
    });

    if (!branches.length) {
      throw new NotFoundException(`지점 이름 ${bname}을 찾을 수 없습니다.`);
    }

    return branches.map(
      (b) => this.loadEntity(b)
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

    if(!branches.length) {
      throw new NotFoundException(`지점 위치 ${loc}을 찾을 수 없습니다.`);
    }

    return branches.map(
      (b) => this.loadEntity(b)
    );
  }

  // 수정
  async update(id: number, data: UpdateBranchDto): Promise<BranchEntity> {
    const branches = await this.prisma.branch.update({
      where: { branch_id: id },
      data,
    });

    return this.loadEntity(branches);
  }

  // change state(USE, NOTUSE)
  async changeUseState(id: number, state: UseState): Promise<BranchEntity> {
    const branches = await this.prisma.branch.update({
      where: { branch_id: id },
      data: { isused: state },
    });
    
    return this.loadEntity(branches);
  }
}