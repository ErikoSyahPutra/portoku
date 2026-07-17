import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
    private readonly translationService: TranslationService,
  ) {}

  async get(lang?: string) {
    const profiles = await this.repo.find();
    let item: Profile;
    if (profiles.length === 0) {
      // Create default profile
      const defaultProfile = this.repo.create({
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: 'Passionate developer building modern web experiences.',
        aboutMe: 'I am a creative developer who loves building beautiful and functional web applications.',
      });
      item = await this.repo.save(defaultProfile);
    } else {
      item = profiles[0];
    }

    if (lang === 'en') {
      item.title = await this.translationService.translate(item.title, 'en');
      item.bio = await this.translationService.translate(item.bio, 'en');
      item.aboutMe = await this.translationService.translate(item.aboutMe, 'en');
    }

    return item;
  }

  async update(data: Partial<Profile>) {
    const profile = await this.get();
    const { id, ...updateData } = data;
    await this.repo.update(profile.id, updateData);
    return this.repo.findOneBy({ id: profile.id });
  }
}
