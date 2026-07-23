import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Get()
  findAll(@Query('lang') lang?: string) {
    return this.service.findAll(lang);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Query('lang') lang?: string) {
    return this.service.findOne(id, lang);
  }

  @Post()
  create(@Body() data: Partial<Organization>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Organization>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
