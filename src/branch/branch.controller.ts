import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
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

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.branchService.findById(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
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