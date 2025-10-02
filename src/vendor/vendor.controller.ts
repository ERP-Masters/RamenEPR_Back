import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }
}