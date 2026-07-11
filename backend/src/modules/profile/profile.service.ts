import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async get() {
    const profiles = await this.repo.find();
    if (profiles.length === 0) {
      // Create default profile
      const defaultProfile = this.repo.create({
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate developer building modern web experiences.',
        aboutMe: 'I am a creative developer who loves building beautiful and functional web applications.',
      });
      return this.repo.save(defaultProfile);
    }
    return profiles[0];
  }

  async update(data: Partial<Profile>) {
    const profile = await this.get();
    await this.repo.update(profile.id, data);
    return this.repo.findOneBy({ id: profile.id });
  }
}
