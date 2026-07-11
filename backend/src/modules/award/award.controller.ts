import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AwardService } from './award.service';
import { Award } from './award.entity';

@Controller('awards')
export class AwardController {
  constructor(private readonly service: AwardService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Award>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Award>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
