// src/reviews/dto/create-review.dto.ts
import { IsNotEmpty, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID() // Ensure productId is a valid UUID
  productId: string;

  @IsNotEmpty()
  @IsInt() // Rating should be an integer
  @Min(1)  // Minimum rating of 1
  @Max(5)  // Maximum rating of 5
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}