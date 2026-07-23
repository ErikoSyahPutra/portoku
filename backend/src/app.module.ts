import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ProjectModule } from './modules/project/project.module';
import { AcademicModule } from './modules/academic/academic.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { BlogModule } from './modules/blog/blog.module';
import { AwardModule } from './modules/award/award.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { TranslationModule } from './modules/translation/translation.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {
            type: 'sqlite',
            database: join(process.cwd(), 'database.sqlite'),
            autoLoadEntities: true,
            synchronize: true,
          }
    ),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ProjectModule,
    AcademicModule,
    ExperienceModule,
    BlogModule,
    AwardModule,
    ProfileModule,
    UploadModule,
    AuthModule,
    TranslationModule,
    OrganizationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
