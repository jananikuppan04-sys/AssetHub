import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

class FileService {
  private uploadDir = path.join(__dirname, '../../public/uploads');

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveImage(buffer: Buffer, mimetype: string): Promise<string> {
    const filename = `${crypto.randomUUID()}.webp`;
    const filepath = path.join(this.uploadDir, filename);

    // Compress and convert to webp using Sharp
    await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    return `/uploads/${filename}`;
  }

  async saveDocument(buffer: Buffer, originalName: string): Promise<string> {
    const ext = path.extname(originalName);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    await fs.writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const filename = path.basename(fileUrl);
    const filepath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }
}

export const fileService = new FileService();
