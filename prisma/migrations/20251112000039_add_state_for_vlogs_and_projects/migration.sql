-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';

-- AlterTable
ALTER TABLE "public"."Vlog" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';
