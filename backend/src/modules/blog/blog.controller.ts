import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';

@Controller('blogs')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get()
  findAll(@Query('lang') lang?: string) {
    return this.service.findPublished(lang);
  }

  @Get('all')
  findAllIncludingDrafts(@Query('lang') lang?: string) {
    return this.service.findAll(lang);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.service.findBySlug(slug, lang);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Query('lang') lang?: string) {
    return this.service.findOne(id, lang);
  }

  @Post()
  create(@Body() data: Partial<Blog>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Blog>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
