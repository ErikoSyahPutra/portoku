import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import ImageKit from 'imagekit';

@Controller('upload')
export class UploadController {
  private imagekit: ImageKit | null = null;

  constructor() {
    if (process.env.IMAGEKIT_PRIVATE_KEY) {
      this.imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
      });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
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
    const ext = extname(file.originalname);
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
      } catch (error) {
        throw new BadRequestException(`ImageKit upload failed: ${error.message}`);
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
    } catch (error) {
      throw new BadRequestException(`Local disk save failed: ${error.message}`);
    }

    return {
      url: `/uploads/${filename}`,
      filename: filename,
      size: file.size,
    };
  }
}
