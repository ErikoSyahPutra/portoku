import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Award } from './award.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class AwardService {
  constructor(
    @InjectRepository(Award)
    private readonly repo: Repository<Award>,
    private readonly translationService: TranslationService,
  ) {}

  async translateItem(item: Award | null, lang?: string): Promise<Award | null> {
    if (!item || lang !== 'en') {
      return item;
    }
    item.title = await this.translationService.translate(item.title, 'en');
    item.description = await this.translationService.translate(item.description, 'en');
    return item;
  }

  async translateItems(items: Award[], lang?: string): Promise<Award[]> {
    if (lang !== 'en') {
      return items;
    }
    return Promise.all(items.map(item => this.translateItem(item, lang) as Promise<Award>));
  }

  async findAll(lang?: string) {
    const items = await this.repo.find({ order: { year: 'DESC', order: 'ASC' } });
    return this.translateItems(items, lang);
  }

  async findOne(id: number, lang?: string) {
    const item = await this.repo.findOneBy({ id });
    return this.translateItem(item, lang);
  }

  create(data: Partial<Award>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Award>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
