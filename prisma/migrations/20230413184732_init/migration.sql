-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "zipCode" VARCHAR(255) NOT NULL,
    "applicationId" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vin" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "make" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "applicationId" INTEGER,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "isPrimaryAccountHolder" BOOLEAN,
    "relationship" TEXT,
    "applicationId" INTEGER,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceApplication" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER,
    "vehicleId" INTEGER,
    "beneficiaryId" INTEGER,

    CONSTRAINT "InsuranceApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "Vehicle"("vin");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InsuranceApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InsuranceApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InsuranceApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
