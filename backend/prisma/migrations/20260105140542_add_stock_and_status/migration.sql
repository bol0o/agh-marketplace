-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 1;
