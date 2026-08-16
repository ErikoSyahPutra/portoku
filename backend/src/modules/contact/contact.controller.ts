import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';

@Controller('contacts')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: Partial<Contact>) {
    return this.service.create(data);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.service.markAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
