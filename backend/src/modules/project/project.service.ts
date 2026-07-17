import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
    private readonly translationService: TranslationService,
  ) {}

  async translateItem(item: Project | null, lang?: string): Promise<Project | null> {
    if (!item || lang !== 'en') {
      return item;
    }
    const cloned = { ...item };
    cloned.title = await this.translationService.translate(item.title, 'en');
    cloned.description = await this.translationService.translate(item.description, 'en');
    return cloned;
  }

  async translateItems(items: Project[], lang?: string): Promise<Project[]> {
    if (lang !== 'en') {
      return items;
    }
    return Promise.all(items.map(item => this.translateItem(item, lang) as Promise<Project>));
  }

  async findAll(lang?: string) {
    const items = await this.repo.find({ order: { order: 'ASC', createdAt: 'DESC' } });
    return this.translateItems(items, lang);
  }

  async findFeatured(lang?: string) {
    const items = await this.repo.find({ where: { featured: true }, order: { order: 'ASC' } });
    return this.translateItems(items, lang);
  }

  async findOne(id: number, lang?: string) {
    const item = await this.repo.findOneBy({ id });
    return this.translateItem(item, lang);
  }

  create(data: Partial<Project>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Project>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
