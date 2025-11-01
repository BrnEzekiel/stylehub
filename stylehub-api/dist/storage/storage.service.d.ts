import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export declare class StorageService implements OnModuleInit {
    private configService;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    upload(fileBuffer: Buffer, folder: string, resourceType?: 'image' | 'raw' | 'video' | 'auto'): Promise<UploadApiResponse | UploadApiErrorResponse>;
}
