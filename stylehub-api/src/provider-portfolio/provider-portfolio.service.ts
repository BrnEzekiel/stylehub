import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SubmitPortfolioDto } from './dto/submit-portfolio.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class ProviderPortfolioService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async getPortfolioStatus(userId: string) {
    const portfolio = await this.prisma.providerPortfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    return portfolio;
  }

  async submitPortfolio(userId: string, dto: SubmitPortfolioDto, videoFile: any) {
    const existing = await this.prisma.providerPortfolio.findUnique({
      where: { userId },
    });

    if (existing && (existing.status === 'pending' || existing.status === 'verified')) {
      throw new ConflictException(`Your portfolio is already ${existing.status}.`);
    }

    let videoUrl: string | null = null;
    if (videoFile) {
      try {
        const uploadResult = await this.storageService.upload(
          videoFile.buffer,
          'portfolio-videos',
        );
        videoUrl = uploadResult?.secure_url || null;
      } catch (error) {
        console.error('Video upload failed:', error);
        throw new InternalServerErrorException('Failed to upload video pitch.');
      }
    }

    const data = {
      userId,
      bio: dto.bio,
      portfolioUrl: dto.portfolioUrl,
      videoUrl,
      status: VerificationStatus.pending,
    };

    return this.prisma.providerPortfolio.upsert({
      where: { userId },
      update: data,
      create: data,
    });
  }

  async getPendingPortfolios() {
    return this.prisma.providerPortfolio.findMany({
      where: { status: VerificationStatus.pending },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updatePortfolioStatus(portfolioId: string, status: VerificationStatus) {
    const portfolio = await this.prisma.providerPortfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio) {
      throw new NotFoundException('Portfolio submission not found');
    }

    return this.prisma.providerPortfolio.update({
      where: { id: portfolioId },
      data: { status },
    });
  }
}