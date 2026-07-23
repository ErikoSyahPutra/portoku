import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslationCache } from './translation-cache.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(TranslationCache)
    private readonly repo: Repository<TranslationCache>,
  ) {}

  // Disabling translation: immediately return text as-is
  async translate(text: string, targetLang: string): Promise<string> {
    return text || '';
  }

  // Disabling translation: immediately return markdown text as-is
  async translateMarkdown(text: string, targetLang: string): Promise<string> {
    return text || '';
  }
}
