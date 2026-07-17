import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('translation_cache')
export class TranslationCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'text' })
  sourceText: string;

  @Column({ length: 10 })
  targetLang: string;

  @Column({ type: 'text' })
  translatedText: string;
}
