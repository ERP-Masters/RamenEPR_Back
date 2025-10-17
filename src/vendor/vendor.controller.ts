import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UseState } from '@prisma/client';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Body() dto: CreateVendorDto) {
    return this.vendorService.create(dto);
  }

  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  @Get('state')
  async findNotUsedBranch() { 
    return this.vendorService.findNotUsedVenor();
  }

  @Get('summary')
  async findsummary() {
    return this.vendorService.findIdAndName();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.vendorService.update(+id, dto);
  }

 @Put('changestate/:id')
   async changeUseState(
     @Param('id')
     id: string,
     @Body('state')
     state: UseState
   ) {
     return this.vendorService.changeUseState(+id, state);
   }
}