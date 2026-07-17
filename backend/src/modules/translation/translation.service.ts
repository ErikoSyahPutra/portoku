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

  async translate(text: string, targetLang: string): Promise<string> {
    if (!text || !text.trim() || targetLang === 'id') {
      return text;
    }
    const trimmed = text.trim();
    try {
      const cached = await this.repo.findOneBy({ sourceText: trimmed, targetLang });
      if (cached) {
        return cached.translatedText;
      }

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Google API status error: ${res.status}`);
      }
      const data = await res.json();
      
      let translatedText = '';
      if (data && data[0]) {
        translatedText = data[0].map((x: any) => x[0]).filter(Boolean).join('');
      }

      if (!translatedText) {
        return trimmed;
      }

      const newCache = this.repo.create({
        sourceText: trimmed,
        targetLang,
        translatedText,
      });
      await this.repo.save(newCache);

      return translatedText;
    } catch (err) {
      console.error('Translation error:', err);
      return trimmed;
    }
  }
}
