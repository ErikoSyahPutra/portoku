import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslationCache } from './translation-cache.entity';
import * as crypto from 'crypto';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(TranslationCache)
    private readonly repo: Repository<TranslationCache>,
  ) {}

  private getHash(text: string, targetLang: string): string {
    return crypto
      .createHash('sha256')
      .update(text + ':' + targetLang)
      .digest('hex');
  }

  async translate(text: string, targetLang: string): Promise<string> {
    if (!text || !text.trim()) {
      return text;
    }
    const trimmed = text.trim();
    const sourceHash = this.getHash(trimmed, targetLang);
    try {
      const cached = await this.repo.findOneBy({ sourceHash });
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
        sourceHash,
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

  async translateMarkdown(text: string, targetLang: string): Promise<string> {
    if (!text || !text.trim()) {
      return text;
    }
    const paragraphs = text.split('\n\n');
    const translatedParagraphs = await Promise.all(
      paragraphs.map(async (paragraph) => {
        if (paragraph.includes('```')) {
          return paragraph;
        }
        
        if (paragraph.length > 1000) {
          const lines = paragraph.split('\n');
          const translatedLines = await Promise.all(
            lines.map(async (line) => {
              if (!line.trim()) {
                return line;
              }
              return this.translate(line, targetLang);
            })
          );
          return translatedLines.join('\n');
        } else {
          return this.translate(paragraph, targetLang);
        }
      })
    );
    return translatedParagraphs.join('\n\n');
  }
}
