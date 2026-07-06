-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM (
  'IN_REVIEW',
  'APPROVED',
  'IN_PROGRESS',
  'FINISHED',
  'CANCELED'
);

-- CreateEnum
CREATE TYPE "ProjectRisk" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Project"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "ProjectStatus" USING ("status"::"ProjectStatus"),
  ALTER COLUMN "status" SET DEFAULT 'IN_REVIEW';

ALTER TABLE "Project"
  ALTER COLUMN "risk" DROP DEFAULT,
  ALTER COLUMN "risk" TYPE "ProjectRisk" USING ("risk"::"ProjectRisk"),
  ALTER COLUMN "risk" SET DEFAULT 'LOW';
