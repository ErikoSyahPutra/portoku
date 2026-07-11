import { Controller, Get, Put, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  update(@Body() data: Partial<Profile>) {
    return this.service.update(data);
  }
}
