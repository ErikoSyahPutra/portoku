import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from './auth.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;

    // Allow all public GET reads
    if (method === 'GET') {
      return true;
    }

    // Allow the login endpoint
    if (path.includes('/api/auth/login')) {
      return true;
    }

    // Protect all other POST, PUT, DELETE requests
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Session expired or invalid token');
    }

    request.user = payload;
    return true;
  }
}
