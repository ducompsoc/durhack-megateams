/*
  Warnings:

  - You are about to drop the column `challenge_rank` on the `QrCode` table. All the data in the column will be lost.
  - You are about to drop the column `expiry_time` on the `QrCode` table. All the data in the column will be lost.
  - You are about to drop the column `max_uses` on the `QrCode` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `QrCode` table. All the data in the column will be lost.
  - Added the required column `claim_limit` to the `QrCode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Quest_dependency_mode" AS ENUM ('AND', 'OR');

-- DropIndex
DROP INDEX "QrCode_challenge_rank_key";

-- AlterTable
ALTER TABLE "QrCode" DROP COLUMN "challenge_rank",
DROP COLUMN "expiry_time",
DROP COLUMN "max_uses",
DROP COLUMN "start_time",
ADD COLUMN     "challenge_id" INTEGER,
ADD COLUMN     "claim_limit" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Challenge" (
    "challenge_id" SERIAL NOT NULL,
    "claim_limit" BOOLEAN NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "points" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("challenge_id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "quest_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "dependencyMode" "Quest_dependency_mode" NOT NULL DEFAULT 'AND',
    "points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("quest_id")
);

-- CreateTable
CREATE TABLE "_ChallengeToQuest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeToQuest_AB_unique" ON "_ChallengeToQuest"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeToQuest_B_index" ON "_ChallengeToQuest"("B");

-- CreateIndex
CREATE INDEX "QrCode_challenge_id_idx" ON "QrCode"("challenge_id");

-- AddForeignKey
ALTER TABLE "QrCode" ADD CONSTRAINT "QrCode_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("challenge_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToQuest" ADD CONSTRAINT "_ChallengeToQuest_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("challenge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToQuest" ADD CONSTRAINT "_ChallengeToQuest_B_fkey" FOREIGN KEY ("B") REFERENCES "Quest"("quest_id") ON DELETE CASCADE ON UPDATE CASCADE;
