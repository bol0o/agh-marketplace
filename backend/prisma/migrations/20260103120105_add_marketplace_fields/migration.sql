-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "condition" TEXT NOT NULL DEFAULT 'used',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Kraków',
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
