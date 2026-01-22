/*
  Warnings:

  - Added the required column `shippingBuildingNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingApartmentNumber" TEXT,
ADD COLUMN     "shippingBuildingNumber" TEXT NOT NULL;
