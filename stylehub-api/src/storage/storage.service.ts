// src/storage/storage.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Stream } from 'stream';

@Injectable()
export class StorageService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Configure Cloudinary with keys from .env
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  /**
   * Uploads a file buffer to Cloudinary.
   * @param fileBuffer The buffer of the file to upload.
   * @param folder The Cloudinary folder to store the file in (e.g., 'kyc', 'assets').
   * @param resourceType The type of resource (default: 'auto').
   * @returns A promise that resolves with the upload response.
   */
  async upload(
    fileBuffer: Buffer,
    folder: string,
    resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    // ================================================
    // DEBUG LOG 1: Fired when the upload starts
    console.log(`[StorageService] Attempting to upload file to folder: ${folder}`);
    // ================================================

    return new Promise((resolve, reject) => {
      // Create a readable stream from the buffer
      const readableStream = new Stream.Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null); // Signal end of stream

      // Create an upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resourceType,
        },
        (error, result) => {
          // ================================================
          // DEBUG LOG 2: Fired when Cloudinary responds (or fails)
          console.log('[StorageService] Cloudinary response received.');
          // ================================================

          if (error) {
            console.error('[StorageService] Cloudinary Upload Error:', error); // Log error
            return reject(error);
          }
          if (result) {
            console.log('[StorageService] Cloudinary Upload Success.'); // Log success
            resolve(result);
          } else {
            reject(new Error('Cloudinary upload failed to return a result.'));
          }
        },
      );

      // Pipe the file stream to the Cloudinary stream
      readableStream.pipe(uploadStream);
    });
  }
}