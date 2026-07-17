import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationCache } from './translation-cache.entity';
import { TranslationService } from './translation.service';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationCache])],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
