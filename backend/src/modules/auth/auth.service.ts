import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hashPassword, generateSalt, generateToken } from './auth.helper';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepo.count();
    if (count === 0) {
      const salt = generateSalt();
      const passwordHash = hashPassword('admin', salt);
      const defaultUser = this.userRepo.create({
        username: 'admin',
        passwordHash,
        salt,
      });
      await this.userRepo.save(defaultUser);
      console.log('🔑 Seeded default administrator user (username: admin, password: admin)');
    }
  }

  async login(username: string, pass: string) {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hash = hashPassword(pass, user.salt);
    if (hash !== user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = generateToken({ sub: user.id, username: user.username });
    return { token, username: user.username };
  }
}
