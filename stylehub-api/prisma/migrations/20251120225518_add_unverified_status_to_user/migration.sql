-- AlterEnum
ALTER TYPE "VerificationStatus" ADD VALUE 'UNVERIFIED';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationStatus" SET DEFAULT 'UNVERIFIED';
