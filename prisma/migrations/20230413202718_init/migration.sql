/*
  Warnings:

  - You are about to drop the column `addressId` on the `InsuranceApplication` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiaryId` on the `InsuranceApplication` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `InsuranceApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InsuranceApplication" DROP COLUMN "addressId",
DROP COLUMN "beneficiaryId",
DROP COLUMN "vehicleId";
