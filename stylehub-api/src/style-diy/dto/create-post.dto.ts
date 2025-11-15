// src/style-diy/dto/create-post.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  @IsOptional()
  serviceId?: string;

  // Allow image and video as strings (for backwards compatibility with FormData)
  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  video?: string;
}

