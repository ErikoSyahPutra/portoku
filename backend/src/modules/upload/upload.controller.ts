import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import ImageKit = require('imagekit');

@Controller('upload')
export class UploadController {
  private imagekit: ImageKit | null = null;

  constructor() {
    if (
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      this.imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Only image files (JPG, PNG, GIF, WebP) are allowed'), false);
        }

        const ext = extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        if (!allowedExtensions.includes(ext)) {
          return cb(new BadRequestException('Invalid file extension'), false);
        }

        const mimeToExt: Record<string, string[]> = {
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/jpg': ['.jpg', '.jpeg'],
          'image/gif': ['.gif'],
          'image/webp': ['.webp'],
        };
        if (!mimeToExt[file.mimetype]?.includes(ext)) {
          return cb(new BadRequestException('MIME-type does not match file extension'), false);
        }

        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname).toLowerCase();
    const filename = `${uniqueSuffix}${ext}`;

    // 1. Upload to ImageKit if keys are configured
    if (this.imagekit) {
      try {
        const response = await this.imagekit.upload({
          file: file.buffer,
          fileName: filename,
          folder: '/portfolio',
        });
        return {
          url: response.url,
          filename: response.name,
          size: response.size,
        };
      } catch (error: any) {
        throw new InternalServerErrorException(`ImageKit upload failed: ${error?.message || error}`);
      }
    }

    // 2. Fallback to local storage (Development/Offline mode)
    const uploadDir = join(process.cwd(), 'uploads');
    try {
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      const localPath = join(uploadDir, filename);
      writeFileSync(localPath, file.buffer);
    } catch (error: any) {
      throw new InternalServerErrorException(`Local disk save failed: ${error?.message || error}`);
    }

    return {
      url: `/uploads/${filename}`,
      filename: filename,
      size: file.size,
    };
  }
}
