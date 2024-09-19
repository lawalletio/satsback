/*
  Warnings:

  - Changed the type of `voucher` on the `Volunteer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "voucher",
ADD COLUMN     "voucher" INTEGER NOT NULL;
