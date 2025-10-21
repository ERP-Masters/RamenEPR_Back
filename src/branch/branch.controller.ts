import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UseState } from "@prisma/client";
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  async create(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }

  @Get()
  async findAll() {
    return this.branchService.findAll();
  }

  @Get('state')
  async notUsedBranch() {
    return this.branchService.notUsedBranch();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.branchService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateBranchDto) {
    return this.branchService.update(+id, dto);
  }

  @Put('changestate/:id')
  async changeUseState(
    @Param('id') 
    id: number,
    @Body('state')
    state: UseState
  ) 
    {
    return this.branchService.changeUseState(+id, state);
  }

  @Get('search/name/:bname')
  async findByBName(@Param('bname') bname: string) {
    return this.branchService.findByBName(bname);
  }

  @Get('search/location/:loc')
  async findByLocationOrDetail(@Param('loc') loc: string) {
    return this.branchService.findByLocationOrDetail(loc);
  }
}