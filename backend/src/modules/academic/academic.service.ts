import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Academic } from './academic.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Academic)
    private readonly repo: Repository<Academic>,
    private readonly translationService: TranslationService,
  ) {}

  async translateItem(item: Academic | null, lang?: string): Promise<Academic | null> {
    if (!item || lang !== 'en') {
      return item;
    }
    item.institution = await this.translationService.translate(item.institution, 'en');
    item.degree = await this.translationService.translate(item.degree, 'en');
    item.field = await this.translationService.translate(item.field, 'en');
    item.description = await this.translationService.translate(item.description, 'en');
    return item;
  }

  async translateItems(items: Academic[], lang?: string): Promise<Academic[]> {
    if (lang !== 'en') {
      return items;
    }
    return Promise.all(items.map(item => this.translateItem(item, lang) as Promise<Academic>));
  }

  async findAll(lang?: string) {
    const items = await this.repo.find({ order: { startYear: 'DESC' } });
    return this.translateItems(items, lang);
  }

  async findOne(id: number, lang?: string) {
    const item = await this.repo.findOneBy({ id });
    return this.translateItem(item, lang);
  }

  create(data: Partial<Academic>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Academic>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
