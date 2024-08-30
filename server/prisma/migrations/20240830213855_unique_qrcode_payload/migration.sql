/*
  Warnings:

  - A unique constraint covering the columns `[payload]` on the table `QrCode` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `payload` on the `QrCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "QrCode" DROP COLUMN "payload",
ADD COLUMN     "payload" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_payload_key" ON "QrCode"("payload");
