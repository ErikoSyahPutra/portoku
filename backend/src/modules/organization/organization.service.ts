import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly repo: Repository<Organization>,
    private readonly translationService: TranslationService,
  ) {}

  async translateItem(item: Organization | null, lang?: string): Promise<Organization | null> {
    if (!item || (lang !== 'en' && lang !== 'id')) {
      return item;
    }
    const cloned = { ...item };
    cloned.organization = await this.translationService.translate(item.organization, lang);
    cloned.role = await this.translationService.translate(item.role, lang);
    cloned.location = await this.translationService.translate(item.location, lang);
    cloned.description = await this.translationService.translate(item.description, lang);
    return cloned;
  }

  async translateItems(items: Organization[], lang?: string): Promise<Organization[]> {
    if (lang !== 'en' && lang !== 'id') {
      return items;
    }
    return Promise.all(items.map(item => this.translateItem(item, lang) as Promise<Organization>));
  }

  async findAll(lang?: string) {
    const items = await this.repo.find({ order: { order: 'ASC', startDate: 'DESC' } });
    return this.translateItems(items, lang);
  }

  async findOne(id: number, lang?: string) {
    const item = await this.repo.findOneBy({ id });
    return this.translateItem(item, lang);
  }

  create(data: Partial<Organization>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Organization>) {
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
