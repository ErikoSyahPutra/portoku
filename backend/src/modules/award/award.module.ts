import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Award } from './award.entity';
import { AwardService } from './award.service';
import { AwardController } from './award.controller';
import { TranslationModule } from '../translation/translation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Award]),
    TranslationModule,
  ],
  providers: [AwardService],
  controllers: [AwardController],
  exports: [AwardService],
})
export class AwardModule {}
