/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "public_id" TEXT;

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "pfp_public_id" TEXT,
ALTER COLUMN "bio" SET DEFAULT '';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
