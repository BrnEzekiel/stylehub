import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SubmitPortfolioDto {
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsUrl()
  @IsNotEmpty()
  portfolioUrl: string;
}