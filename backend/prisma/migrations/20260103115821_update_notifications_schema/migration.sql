-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "link" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Powiadomienie';
