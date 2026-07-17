import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  get(@Query('lang') lang?: string) {
    return this.service.get(lang);
  }

  @Put()
  update(@Body() data: Partial<Profile>) {
    return this.service.update(data);
  }
}
