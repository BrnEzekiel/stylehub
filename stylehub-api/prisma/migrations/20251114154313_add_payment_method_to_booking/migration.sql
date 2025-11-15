-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('mpesa', 'bank_transfer', 'cash_on_delivery');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash_on_delivery';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "subtotal" SET DEFAULT 0.00;
