-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "visibleWeb" BOOLEAN NOT NULL DEFAULT true;
