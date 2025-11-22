import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';
import { Stay, Prisma, StayType, AmenityType, StayImage } from '@prisma/client';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

@Injectable()
export class StaysService {
  constructor(private prisma: PrismaService) {}

  private async validateOwnership(userId: string, stayId: string): Promise<void> {
    const stay = await this.prisma.stay.findUnique({
      where: { id: stayId },
      select: { ownerId: true },
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    if (stay.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this stay');
    }
  }

  async create(
    userId: string,
    createStayDto: CreateStayDto,
    files: Express.Multer.File[],
  ) {
    const { amenities, ...stayData } = createStayDto;

    // Create the stay with the first image as primary
    const stay = await this.prisma.$transaction(async (prisma) => {
      const createdStay = await prisma.stay.create({
        data: {
          ...stayData,
          ownerId: userId,
          images: {
            create: files.map((file, index) => ({
              url: `/uploads/stays/${file.filename}`,
              isPrimary: index === 0,
            })),
          },
        },
        include: {
          images: true,
        },
      });

      // Add amenities if provided
      if (amenities && amenities.length > 0) {
        await prisma.stayAmenity.createMany({
          data: amenities.map((type) => ({
            stayId: createdStay.id,
            type,
            isAvailable: true,
          })),
          skipDuplicates: true,
        });
      }

      return createdStay;
    });

    return this.prisma.stay.findUnique({
      where: { id: stay.id },
      include: {
        images: true,
        amenities: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: StayType;
    page: number;
    limit: number;
  }) {
    const { city, minPrice, maxPrice, type, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.StayWhereInput = {
      isAvailable: true,
    };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (type) where.type = type;
    if (minPrice) where.pricePerMonth = { gte: minPrice };
    if (maxPrice) where.pricePerMonth = { ...(where.pricePerMonth as object), lte: maxPrice };

    const [stays, total] = await Promise.all([
      this.prisma.stay.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stay.count({ where }),
    ]);

    return {
      data: stays,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.StayWhereInput = {
      isAvailable: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [stays, total] = await Promise.all([
      this.prisma.stay.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stay.count({ where }),
    ]);

    return {
      data: stays,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const stay = await this.prisma.stay.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    return stay;
  }

  async findByOwner(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [stays, total] = await Promise.all([
      this.prisma.stay.findMany({
        where: { ownerId: userId },
        skip,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { bookings: true, reviews: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.stay.count({ where: { ownerId: userId } }),
    ]);

    return {
      data: stays,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(userId: string, id: string, updateStayDto: UpdateStayDto) {
    await this.validateOwnership(userId, id);

    // FIX: Destructure amenities from the DTO, just like in the create() function
    const { amenities, ...updateData } = updateStayDto;

    return this.prisma.$transaction(async (prisma) => {
      // Update basic stay info
      const updatedStay = await prisma.stay.update({
        where: { id },
        // FIX: updateData now only contains simple fields, resolving the TS error
        data: updateData,
      });

      // Update amenities if provided
      // FIX: 'amenities' variable is now correctly defined in this scope
      if (amenities && Array.isArray(amenities)) {
        // Delete existing amenities
        await prisma.stayAmenity.deleteMany({
          where: { stayId: id },
        });

        // Add new amenities
        if (amenities.length > 0) {
          await prisma.stayAmenity.createMany({
            data: amenities.map((type) => ({
              stayId: id,
              type,
              isAvailable: true,
            })),
          });
        }
      }

      return this.prisma.stay.findUnique({
        where: { id },
        include: {
          images: true,
          amenities: true,
        },
      });
    });
  }

  async remove(userId: string, id: string) {
    await this.validateOwnership(userId, id);

    // First, get all image paths to delete files
    const stay = await this.prisma.stay.findUnique({
      where: { id },
      include: { images: true },
    });

    // Delete the stay (cascading deletes will handle related records)
    await this.prisma.stay.delete({
      where: { id },
    });

    // Delete the image files
    if (stay?.images?.length > 0) {
      await Promise.all(
        stay.images.map((image) => {
          const filePath = join(process.cwd(), 'public', image.url);
          if (existsSync(filePath)) {
            return unlinkAsync(filePath).catch(console.error);
          }
          return Promise.resolve();
        }),
      );
    }

    return { message: 'Stay deleted successfully' };
  }

  async addImages(userId: string, stayId: string, files: Express.Multer.File[]) {
    await this.validateOwnership(userId, stayId);

    // Check if the stay exists
    const stay = await this.prisma.stay.findUnique({
      where: { id: stayId },
      select: { id: true },
    });

    if (!stay) {
      throw new NotFoundException('Stay not found');
    }

    // Create image records
    await this.prisma.stayImage.createMany({
      data: files.map((file) => ({
        stayId,
        url: `/uploads/stays/${file.filename}`,
        isPrimary: false,
      })),
    });

    return this.prisma.stayImage.findMany({
      where: { stayId },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async setPrimaryImage(userId: string, stayId: string, imageId: string) {
    await this.validateOwnership(userId, stayId);

    // Check if the image exists and belongs to the stay
    const image = await this.prisma.stayImage.findUnique({
      where: { id: imageId },
      select: { id: true, stayId: true },
    });

    if (!image || image.stayId !== stayId) {
      throw new NotFoundException('Image not found');
    }

    // Start transaction to update primary image
    return this.prisma
      .$transaction([
        // Set all images to not primary
        this.prisma.stayImage.updateMany({
          where: { stayId },
          data: { isPrimary: false },
        }),
        // Set the selected image as primary
        this.prisma.stayImage.update({
          where: { id: imageId },
          data: { isPrimary: true },
        }),
      ])
      .then(([, primaryImage]) => primaryImage);
  }

  async removeImage(userId: string, stayId: string, imageId: string) {
    await this.validateOwnership(userId, stayId);

    // Check if the image exists and belongs to the stay
    const image = await this.prisma.stayImage.findUnique({
      where: { id: imageId },
      select: { id: true, stayId: true, url: true, isPrimary: true },
    });

    if (!image || image.stayId !== stayId) {
      throw new NotFoundException('Image not found');
    }

    // Don't allow deleting the only image
    const imageCount = await this.prisma.stayImage.count({
      where: { stayId },
    });

    if (imageCount <= 1) {
      throw new BadRequestException('Cannot delete the only image of a stay');
    }

    // Delete the image record
    await this.prisma.stayImage.delete({
      where: { id: imageId },
    });

    // Delete the actual file
    const filePath = join(process.cwd(), 'public', image.url);
    if (existsSync(filePath)) {
      await unlinkAsync(filePath).catch(console.error);
    }

    // If the deleted image was primary, set another image as primary
    if (image.isPrimary) {
      const nextImage = await this.prisma.stayImage.findFirst({
        where: { stayId, id: { not: imageId } },
        orderBy: { createdAt: 'asc' },
      });

      if (nextImage) {
        await this.prisma.stayImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    return { message: 'Image deleted successfully' };
  }
}