import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from './repository/branch.repository';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchEntity } from './entities/branch.entity';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  async create(dto: CreateBranchDto): Promise<BranchEntity> {
    return this.branchRepository.create(dto);
  }

  async findAll(): Promise<BranchEntity[]> {
    return this.branchRepository.findAll();
  }

  async findById(id: number): Promise<BranchEntity> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) throw new NotFoundException(`Branch with ID ${id} not found`);
    return branch;
  }

  async update(id: number, dto: UpdateBranchDto): Promise<BranchEntity> {
    return this.branchRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    return this.branchRepository.remove(id);
  }

  async findByBName(bname: string): Promise<BranchEntity[]> {
    return this.branchRepository.findByBName(bname);
  }

  async findByLocationOrDetail(loc: string): Promise<BranchEntity[]> {
    return this.branchRepository.findByLocationOrDetail(loc);
  }
}