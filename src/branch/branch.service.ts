import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from './repository/branch.repository';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';
import { UseState } from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  async create(dto: CreateBranchDto): Promise<BranchEntity> {
    return this.branchRepository.create(dto);
  }

  async findAll(): Promise<BranchEntity[]> {
    return this.branchRepository.findAll();
  }

  async notUsedBranch(): Promise<BranchEntity[]> {
    return this.branchRepository.notUsedBranch();
  }

  async findById(id: number): Promise<BranchEntity> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new NotFoundException(`지점 id: ${id}가 존재하지 않습니다. `);
    return branch;
  }

  async findByBName(bname: string): Promise<BranchEntity[]> {
    return this.branchRepository.findByBName(bname);
  }

  async findByLocationOrDetail(loc: string): Promise<BranchEntity[]> {
    return this.branchRepository.findByLocationOrDetail(loc);
  }

  async update(id: number, dto: UpdateBranchDto): Promise<BranchEntity> {
    return this.branchRepository.update(id, dto);
  }

  async changeUseState(id: number, state: UseState): 
  Promise<{ message: string; branch: BranchEntity }> {
    const updated = await this.branchRepository.changeUseState(id, state);
    return {
      message: "지점 ${id}의 상태가 ${state}로 변경되었습니다.",
      branch: updated,
    };
  }
}