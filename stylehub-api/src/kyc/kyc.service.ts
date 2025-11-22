import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { KycStatus } from '@prisma/client';

@Injectable()
export class KycService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  // --- Seller Methods ---

  async getStatus(userId: string) {
    const kyc = await this.prisma.kYC.findUnique({
      where: { userId: userId },
    });

    if (!kyc) {
      // Return a custom status the frontend can understand
      return { status: 'not_submitted' };
    }
    return kyc;
  }

  async submitKyc(
    userId: string,
    doc_type: string, // Kept as snake_case from controller
    docFile: any,
    selfieFile: any,
  ) {
    const existingKyc = await this.prisma.kYC.findUnique({
      where: { userId: userId },
    });

    if (existingKyc && existingKyc.status === 'approved') {
      throw new ConflictException('KYC is already approved.');
    }
    if (existingKyc && existingKyc.status === 'pending') {
      throw new ConflictException(
        'You already have a KYC submission pending review.',
      );
    }

    // --- Upload Files ---
    let doc_url: string;
    let selfie_url: string;
    try {
      const [docUpload, selfieUpload] = await Promise.all([
        this.storageService.upload(docFile.buffer, 'kyc_documents'),
        this.storageService.upload(selfieFile.buffer, 'kyc_selfies'),
      ]);

      if (!docUpload?.secure_url || !selfieUpload?.secure_url) {
        throw new InternalServerErrorException(
          'File upload failed to return a secure URL.',
        );
      }
      doc_url = docUpload.secure_url;
      selfie_url = selfieUpload.secure_url;
    } catch (error) {
      console.error('KYC File Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload KYC files.');
    }

    // 🛑 FIX: This data must use camelCase to match your Prisma schema
    const kycUpdateData = {
      docType: doc_type,
      docUrl: doc_url,
      selfieUrl: selfie_url,
      status: KycStatus.pending,
      // Reset review status on resubmission
      reviewedAt: null,
      remarks: null,
    };

    const kycCreateData = {
      userId: userId,
      docType: doc_type,
      docUrl: doc_url,
      selfieUrl: selfie_url,
      status: KycStatus.pending,
    };

    try {
      const updatedKyc = await this.prisma.kYC.upsert({
        where: { userId: userId },
        update: kycUpdateData, // 🛑 FIX: Use camelCase data
        create: kycCreateData, // 🛑 FIX: Use camelCase data
      }); // 🛑 FIX: This '});' was misplaced. The create block is now closed.
      return updatedKyc;
    } catch (error) {
      console.error(`Failed to submit KYC for user ${userId}:`, error);
      throw new InternalServerErrorException('Could not submit KYC details.');
    }
  }

  // --- Admin Methods ---

  /**
   * Get all KYC submissions that are 'pending'
   */
  async getPendingSubmissions() {
    return this.prisma.kYC.findMany({
      where: { status: KycStatus.pending },
      include: {
        user: {
          // Include the user's name and email
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
   * Approve or Reject a KYC submission
   */
  async updateKycStatus(kycId: string, status: KycStatus) {
    // 1. Find the KYC record
    const kycRecord = await this.prisma.kYC.findUnique({
      where: { id: kycId },
    });

    if (!kycRecord) {
      throw new NotFoundException('KYC record not found');
    }

    // 2. Update the KYC status
    const updatedKyc = await this.prisma.kYC.update({
      where: { id: kycId },
      data: { status: status },
    });

    // 3. (Optional) In a real app, you would emit an event here
    // this.eventEmitter.emit('kyc.status.changed', updatedKyc);

    return updatedKyc;
  }
}