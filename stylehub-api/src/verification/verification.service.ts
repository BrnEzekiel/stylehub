// src/verification/verification.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  /**
   * Get the current verification status for the logged-in seller.
   */
  async getVerificationStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        verificationStatus: true,
        verification: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: user.verificationStatus,
      submission: user.verification,
    };
  }

  /**
   * Submit or resubmit verification documents.
   */
  async submitVerification(
    userId: string,
    dto: SubmitVerificationDto,
    businessLicenseFile: any,
  ) {
    if (!businessLicenseFile) {
      throw new BadRequestException('Business license file is required.');
    }

    const existing = await this.prisma.verification.findUnique({
      where: { userId },
    });

    if (existing && (existing.status === 'pending' || existing.status === 'approved')) {
      throw new ConflictException(`Your submission is already ${existing.status}.`);
    }

    let licenseUrl: string;
    try {
      const uploadResult = await this.storageService.upload(
        businessLicenseFile.buffer,
        'business-licenses',
      );
      if (!uploadResult?.secure_url) {
        throw new Error('License upload failed to return a secure URL.');
      }
      licenseUrl = uploadResult.secure_url;
    } catch (error) {
      console.error('License upload failed:', error);
      throw new InternalServerErrorException('Failed to upload business license.');
    }

    const data = {
      userId: userId,
      businessName: dto.businessName,
      socialMediaUrl: dto.socialMediaUrl,
      businessLicenseUrl: licenseUrl,
      status: VerificationStatus.pending,
    };

    const newSubmission = await this.prisma.verification.upsert({
      where: { userId: userId },
      update: data,
      create: data,
    });

    // Update the user's main status
    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: VerificationStatus.pending },
    });

    return newSubmission;
  }

  // --- 🛑 NEW: Admin Methods ---

  /**
   * Get all verification submissions that are 'pending'
   */
  async getPendingVerifications() {
    return this.prisma.verification.findMany({
      where: { status: VerificationStatus.pending },
      include: {
        user: { // Include the user's name and email
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Show oldest first
      },
    });
  }

  /**
   * Approve or Reject a verification submission
   */
  async updateVerificationStatus(
    verificationId: string,
    status: VerificationStatus,
  ) {
    // 1. Find the verification record
    const verification = await this.prisma.verification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Verification submission not found');
    }

    // 2. Update the Verification record itself
    const updatedVerification = await this.prisma.verification.update({
      where: { id: verificationId },
      data: { status: status },
    });

    // 3. Update the main User model's status
    await this.prisma.user.update({
      where: { id: verification.userId },
      data: { verificationStatus: status },
    });

    // 4. (Optional) In a real app, you would send a notification here

    return updatedVerification;
  }
}