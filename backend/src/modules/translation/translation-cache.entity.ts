import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('translation_cache')
export class TranslationCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  sourceText: string;

  @Index({ unique: true })
  @Column({ length: 64 })
  sourceHash: string;

  @Column({ length: 10 })
  targetLang: string;

  @Column({ type: 'text' })
  translatedText: string;
}
