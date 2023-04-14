import { PrismaClient } from "@prisma/client";
import assert from "assert";
import type { NextApiRequest } from "next";
import { validateReqBody, wrapEndpoint } from "../../lib/apiHelpers";
import { appMessages, validationConstants } from "../../lib/constants";
import {
  BeneficiaryInput,
  CompletePrismaInsuranceApplication,
  UpdateInsuranceApplicationEndpoint,
  UpdateInsuranceApplicationEndpointBody,
  VehicleInput,
} from "../../lib/definitions";
import {
  ApplicationError,
  checkFieldPresent,
  findPrimaryBeneficiary,
} from "../../lib/helpers";
import { validationSchemas } from "../../lib/validation";

const prisma = new PrismaClient();

/**
 * Updates an insurance application if it exists.
 */
const handler = wrapEndpoint<UpdateInsuranceApplicationEndpoint>(
  async (req: NextApiRequest) => {
    const data = validateReqBody(req, validationSchemas.updateApplicationBody);
    const existingApplication = await prisma.insuranceApplication.findFirst({
      where: { id: data.applicationId },
      include: { address: true, vehicles: true, beneficiaries: true },
    });

    if (!existingApplication) {
      throw new ApplicationError(
        appMessages.errors.insuranceApplicationNotFound
      );
    }

    const newVehicleList = data.add?.vehicles;
    const newBeneficiaryList = data.add?.beneficiaries;

    checkThresholds(existingApplication, newVehicleList, newBeneficiaryList);
    checkPrimaryAccountHolderNotChanged(existingApplication, data);
    checkEveryVehicleIsNotRemoved(existingApplication, data);

    // Update application
    const application = await prisma.insuranceApplication.update({
      where: { id: data.applicationId },
      data: {
        address: {
          updateMany: data.update?.address?.map((next) => ({
            where: { id: next.id },
            data: next.update,
          })),
        },
        vehicles: {
          create: newVehicleList,
          deleteMany: data.remove?.vehicles
            ? { id: { in: data.remove.vehicles } }
            : undefined,
          updateMany: data.update?.vehicles?.map((next) => ({
            where: { id: next.id },
            data: next.update,
          })),
        },
        beneficiaries: {
          create: newBeneficiaryList,
          deleteMany: data.remove?.beneficiaries
            ? { id: { in: data.remove.beneficiaries } }
            : undefined,
          updateMany: data.update?.beneficiaries?.map((next) => ({
            where: { id: next.id },
            data: next.update,
          })),
        },
      },
      include: { address: true, vehicles: true, beneficiaries: true },
    });

    return application;
  },
  ["put"]
);

export default handler;

function checkThresholds(
  existingApplication: CompletePrismaInsuranceApplication,
  newVehicleList?: Array<VehicleInput>,
  newBeneficiaryList?: Array<BeneficiaryInput>
) {
  const errors: ApplicationError[] = [];

  if (
    newVehicleList?.length &&
    existingApplication.vehicles.length >= validationConstants.maxVehiclesCount
  ) {
    errors.push(new ApplicationError(appMessages.errors.maxVehiclesCovered));
  } else if (
    newVehicleList &&
    newVehicleList.length + existingApplication.vehicles.length >
      validationConstants.maxVehiclesCount
  ) {
    errors.push(
      new ApplicationError(
        appMessages.errors.willExceedMaxVehiclesCovered(newVehicleList.length)
      )
    );
  }

  if (
    newBeneficiaryList?.length &&
    existingApplication.beneficiaries.length >=
      validationConstants.maxBeneficiariesCount
  ) {
    errors.push(
      new ApplicationError(appMessages.errors.maxBeneficiariesCovered)
    );
  } else if (
    newBeneficiaryList &&
    newBeneficiaryList.length + existingApplication.beneficiaries.length >
      validationConstants.maxBeneficiariesCount
  ) {
    errors.push(
      new ApplicationError(
        appMessages.errors.willExceedMaxBeneficiariesCovered(
          newBeneficiaryList.length
        )
      )
    );
  }

  if (errors.length) throw errors;
}

function checkPrimaryAccountHolderNotChanged(
  existingApplication: CompletePrismaInsuranceApplication,
  updateBody: UpdateInsuranceApplicationEndpointBody
) {
  // Check if primary beneficiary is not removed
  const removedBeneficiariesIds = updateBody.remove?.beneficiaries ?? [];
  const primaryBeneficiary = findPrimaryBeneficiary(
    existingApplication.beneficiaries
  );

  assert(primaryBeneficiary);
  if (removedBeneficiariesIds.includes(primaryBeneficiary.id)) {
    throw new ApplicationError(
      appMessages.errors.cannotRemovePrimaryBeneficiary
    );
  }

  // Check if primary benificary's status as primary beneficiary is not updated
  const updatedBeneficiaryList = updateBody.update?.beneficiaries ?? [];
  const updatedPrimaryBeneficiary = updatedBeneficiaryList.find(
    (next) => next.id === primaryBeneficiary.id
  );

  if (
    updatedPrimaryBeneficiary &&
    checkFieldPresent(
      updatedPrimaryBeneficiary.update,
      "isPrimaryAccountHolder"
    ) &&
    updatedPrimaryBeneficiary.update.isPrimaryAccountHolder !== true
  ) {
    throw new ApplicationError(
      appMessages.errors.cannotChangePrimaryBeneficiary
    );
  }

  // Check if new primary beneficiaries are not added
  const newPrimaryBeneficiary = updateBody.add?.beneficiaries?.find(
    (next) => next.isPrimaryAccountHolder
  );

  if (newPrimaryBeneficiary) {
    throw new ApplicationError(
      appMessages.errors.moreThanOnePrimaryBeneficiary
    );
  }
}

function checkEveryVehicleIsNotRemoved(
  existingApplication: CompletePrismaInsuranceApplication,
  updateBody: UpdateInsuranceApplicationEndpointBody
) {
  const removedVehiclesIds = updateBody.remove?.vehicles;
  if (removedVehiclesIds) {
    const remainingVehicles = existingApplication.vehicles.filter(
      (next) => !removedVehiclesIds.includes(next.id)
    );

    if (remainingVehicles.length === 0) {
      throw new ApplicationError(appMessages.errors.cannotRemoveEveryVehicle);
    }
  }
}
