// src/services/services.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  /**
   * Create a new service (Provider only)
   */
  async create(providerId: string, dto: CreateServiceDto, file: any) {
    if (!file) {
      throw new BadRequestException('Service image file is required.');
    }

    // Check if provider is approved
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
      include: { kyc: true, providerPortfolio: true },
    });

    if (
      !provider ||
      provider.kyc?.status !== 'approved' ||
      provider.providerPortfolio?.status !== 'verified'
    ) {
      throw new ForbiddenException(
        'You must have approved KYC and an approved Portfolio to create a service.',
      );
    }

    let imageUrl: string;
    try {
      const uploadResult = await this.storageService.upload(file.buffer, 'services');
      if (!uploadResult?.secure_url) {
        throw new Error('Image upload failed to return a secure URL.');
      }
      imageUrl = uploadResult.secure_url;
    } catch (error) {
      console.error('Service image upload failed:', error);
      throw new InternalServerErrorException('Failed to upload service image.');
    }

    const data: Prisma.ServiceCreateInput = {
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priceShopCents: new Prisma.Decimal(dto.priceShopCents),
      priceHomeCents: dto.priceHomeCents
        ? new Prisma.Decimal(dto.priceHomeCents)
        : null,
      offersHome: dto.offersHome,
      durationMinutes: dto.durationMinutes,
      imageUrl: imageUrl,
      provider: {
        connect: { id: providerId },
      },
    };

    return this.prisma.service.create({ data });
  }

  /**
   * Find all services for a specific provider
   */
  async findByProvider(providerId: string) {
    return this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find all services (Public)
   */
  async findAll(category?: string) {
    const where: Prisma.ServiceWhereInput = {
      provider: {
        kyc: { status: 'approved' },
        providerPortfolio: { status: 'verified' },
      },
    };
    if (category) {
      where.category = category;
    }

    return this.prisma.service.findMany({
      where,
      include: {
        provider: {
          select: { name: true, verificationStatus: true },
        },
      },
    });
  }

  /**
   * Find a single service (Public)
   */
  async findOne(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            verificationStatus: true,
            providerPortfolio: true,
          },
        },
      },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
}