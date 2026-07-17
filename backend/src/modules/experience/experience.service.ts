import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly repo: Repository<Experience>,
    private readonly translationService: TranslationService,
  ) {}

  async translateItem(item: Experience | null, lang?: string): Promise<Experience | null> {
    if (!item || (lang !== 'en' && lang !== 'id')) {
      return item;
    }
    const cloned = { ...item };
    cloned.position = await this.translationService.translate(item.position, lang);
    cloned.location = await this.translationService.translate(item.location, lang);
    cloned.description = await this.translationService.translate(item.description, lang);
    return cloned;
  }

  async translateItems(items: Experience[], lang?: string): Promise<Experience[]> {
    if (lang !== 'en' && lang !== 'id') {
      return items;
    }
    return Promise.all(items.map(item => this.translateItem(item, lang) as Promise<Experience>));
  }

  async findAll(lang?: string) {
    const items = await this.repo.find({ order: { order: 'ASC', startDate: 'DESC' } });
    return this.translateItems(items, lang);
  }

  async findOne(id: number, lang?: string) {
    const item = await this.repo.findOneBy({ id });
    return this.translateItem(item, lang);
  }

  create(data: Partial<Experience>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Experience>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
