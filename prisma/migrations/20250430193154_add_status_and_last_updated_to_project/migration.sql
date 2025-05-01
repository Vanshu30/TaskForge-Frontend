-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ADD COLUMN     "status" TEXT DEFAULT 'IN_PROGRESS';
