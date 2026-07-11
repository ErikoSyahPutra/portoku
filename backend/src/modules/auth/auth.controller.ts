import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  login(@Body() credentials: { username: string; pass?: string; password?: string }) {
    const password = credentials.password || credentials.pass || '';
    return this.service.login(credentials.username, password);
  }
}
