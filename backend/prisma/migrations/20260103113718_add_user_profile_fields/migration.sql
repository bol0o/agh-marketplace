-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apartmentNumber" TEXT,
ADD COLUMN     "buildingNumber" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "marketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyPush" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "studentYear" INTEGER,
ADD COLUMN     "zipCode" TEXT;
