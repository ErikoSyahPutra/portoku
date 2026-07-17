import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
    private readonly translationService: TranslationService,
  ) {}

  async translateItem(item: Blog | null, lang?: string): Promise<Blog | null> {
    if (!item || (lang !== 'en' && lang !== 'id')) {
      return item;
    }
    const cloned = { ...item };
    cloned.title = await this.translationService.translate(item.title, lang);
    if (item.excerpt) {
      cloned.excerpt = await this.translationService.translateMarkdown(item.excerpt, lang);
    }
    cloned.content = await this.translationService.translateMarkdown(item.content, lang);
    return cloned;
  }

  async translateItems(items: Blog[], lang?: string): Promise<Blog[]> {
    if (lang !== 'en' && lang !== 'id') {
      return items;
    }
    return Promise.all(items.map(item => this.translateItem(item, lang) as Promise<Blog>));
  }

  async findAll(lang?: string) {
    const items = await this.repo.find({ order: { createdAt: 'DESC' } });
    return this.translateItems(items, lang);
  }

  async findPublished(lang?: string) {
    const items = await this.repo.find({ where: { published: true }, order: { createdAt: 'DESC' } });
    return this.translateItems(items, lang);
  }

  async findBySlug(slug: string, lang?: string) {
    const item = await this.repo.findOneBy({ slug });
    return this.translateItem(item, lang);
  }

  async findOne(id: number, lang?: string) {
    const item = await this.repo.findOneBy({ id });
    return this.translateItem(item, lang);
  }

  create(data: Partial<Blog>) {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (data.content) {
      data.readTime = Math.ceil(data.content.split(/\s+/).length / 200);
    }
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Blog>) {
    if (data.content) {
      data.readTime = Math.ceil(data.content.split(/\s+/).length / 200);
    }
    const { id: _, ...updateData } = data;
    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
