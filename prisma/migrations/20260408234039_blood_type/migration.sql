/*
  Warnings:

  - Changed the type of `bloodType` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "bloodType",
ADD COLUMN     "bloodType" "BloodType" NOT NULL;
