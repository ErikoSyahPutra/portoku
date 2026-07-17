import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from './experience.entity';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly service: ExperienceService) {}

  @Get()
  findAll(@Query('lang') lang?: string) {
    return this.service.findAll(lang);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Query('lang') lang?: string) {
    return this.service.findOne(id, lang);
  }

  @Post()
  create(@Body() data: Partial<Experience>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Experience>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
