import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { Academic } from './academic.entity';

@Controller('academics')
export class AcademicController {
  constructor(private readonly service: AcademicService) {}

  @Get()
  findAll(@Query('lang') lang?: string) {
    return this.service.findAll(lang);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Query('lang') lang?: string) {
    return this.service.findOne(id, lang);
  }

  @Post()
  create(@Body() data: Partial<Academic>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Academic>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
