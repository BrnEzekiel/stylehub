// src/style-diy/dto/create-recommendation.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateRecommendationDto {
  @IsUUID()
  @IsOptional()
  sellerId?: string;

  @IsUUID()
  @IsOptional()
  providerId?: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

