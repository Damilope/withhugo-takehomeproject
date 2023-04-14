import assert from "assert";
import { merge } from "lodash";
import { appMessages, validationConstants } from "../lib/constants";
import {
  GetInsuranceApplicationEndpoint,
  UpdateInsuranceApplicationEndpoint,
  UpdateInsuranceApplicationEndpointBody,
  apiPaths,
} from "../lib/definitions";
import {
  addressInputIndexer,
  beneficiaryInputIndexer,
  callEndpoint,
  toClientsideError,
  vehicleInputIndexer,
} from "../lib/helpers";
import {
  expectContainsExactlyForAnyType,
  generateTestAddress,
  generateTestAddressList,
  generateTestBeneficiary,
  generateTestBeneficiaryList,
  generateTestVehicle,
  generateTestVehicleList,
  insertTestApplication,
} from "./utils";

describe("updateInsuranceApplication", () => {
  test("add new items", async () => {
    const { applicationId, applicationInput } = await insertTestApplication({
      // Supply seed to ensure we don't go above the max for subresources
      beneficiaries: generateTestBeneficiaryList(
        /** count */ validationConstants.minBeneficiariesCount,
        /** seed */ {},
        "valid"
      ),
      address: generateTestAddressList(
        /** count */ validationConstants.minAddressCount
      ),
      vehicles: generateTestVehicleList(
        /** count */ validationConstants.minVehiclesCount
      ),
    });

    const newBeneficiaryList = generateTestBeneficiaryList(
      /** count */ validationConstants.minBeneficiariesCount,
      { isPrimaryAccountHolder: false }
    );
    const newAddressList = generateTestAddressList(
      /** count */ validationConstants.minAddressCount
    );
    const newVehicleList = generateTestVehicleList(
      /** count */ validationConstants.minVehiclesCount
    );

    const application = await callEndpoint<UpdateInsuranceApplicationEndpoint>({
      path: apiPaths.updateInsuranceApplication,
      method: "put",
      body: {
        applicationId,
        add: {
          beneficiaries: newBeneficiaryList,
          vehicles: newVehicleList,
        },
      },
    });

    const update = {
      beneficiaries: applicationInput.beneficiaries.concat(newBeneficiaryList),
      address: newAddressList,
      vehicles: applicationInput.vehicles.concat(newVehicleList),
    };

    expectContainsExactlyForAnyType(
      application.beneficiaries,
      update.beneficiaries,
      beneficiaryInputIndexer,
      beneficiaryInputIndexer
    );
    expectContainsExactlyForAnyType(
      application.vehicles,
      update.vehicles,
      vehicleInputIndexer,
      vehicleInputIndexer
    );
  });

  test("update items", async () => {
    const { applicationId } = await insertTestApplication();
    const existingApplication =
      await callEndpoint<GetInsuranceApplicationEndpoint>({
        path: apiPaths.getInsuranceApplication,
        method: "get",
        query: { applicationId },
      });

    const update = {
      applicationId,
      update: {
        address: existingApplication.address.map((address) => ({
          id: address.id,
          update: generateTestAddress(),
        })),
        beneficiaries: existingApplication.beneficiaries.map((beneficiary) => ({
          id: beneficiary.id,
          update: merge(generateTestBeneficiary(), {
            isPrimaryAccountHolder: beneficiary.isPrimaryAccountHolder,
          }),
        })),
        vehicles: existingApplication.vehicles.map((vehicle) => ({
          id: vehicle.id,
          update: generateTestVehicle(),
        })),
      },
    } satisfies UpdateInsuranceApplicationEndpointBody;

    const application = await callEndpoint<UpdateInsuranceApplicationEndpoint>({
      path: apiPaths.updateInsuranceApplication,
      method: "put",
      body: update,
    });

    expectContainsExactlyForAnyType(
      application.beneficiaries,
      update.update.beneficiaries.map((next) => next.update),
      beneficiaryInputIndexer,
      beneficiaryInputIndexer
    );
    expectContainsExactlyForAnyType(
      application.vehicles,
      update.update.vehicles.map((next) => next.update),
      vehicleInputIndexer,
      vehicleInputIndexer
    );
    expectContainsExactlyForAnyType(
      application.address,
      update.update.address.map((next) => next.update),
      addressInputIndexer,
      addressInputIndexer
    );
  });

  test("delete items", async () => {
    const { applicationId } = await insertTestApplication();
    const existingApplication =
      await callEndpoint<GetInsuranceApplicationEndpoint>({
        path: apiPaths.getInsuranceApplication,
        method: "get",
        query: { applicationId },
      });

    const update = {
      applicationId,
      remove: {
        beneficiaries: existingApplication.beneficiaries
          .filter((beneficiary) => !beneficiary.isPrimaryAccountHolder)
          .map((beneficiary) => beneficiary.id),
        vehicles: existingApplication.vehicles
          .slice(1)
          .map((vehicle) => vehicle.id),
      },
    } satisfies UpdateInsuranceApplicationEndpointBody;

    const application = await callEndpoint<UpdateInsuranceApplicationEndpoint>({
      path: apiPaths.updateInsuranceApplication,
      method: "put",
      body: update,
    });

    // Remaining primary beneficiary
    expect(application.beneficiaries.length).toBe(1);
    expect(application.vehicles.length).toBe(1);
  });

  test("fails if exceeds thresholds", async () => {
    try {
      const { applicationId } = await insertTestApplication({
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.maxBeneficiariesCount,
          /** seed */ {},
          "valid"
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.maxAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.maxVehiclesCount
        ),
      });
      const update = {
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.minBeneficiariesCount
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.minAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.minVehiclesCount
        ),
      };
      await callEndpoint<UpdateInsuranceApplicationEndpoint>({
        path: apiPaths.updateInsuranceApplication,
        method: "put",
        body: {
          applicationId,
          add: {
            beneficiaries: update.beneficiaries,
            vehicles: update.vehicles,
          },
        },
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const exceedsErrors = endpointError.filter(
        (nextError) =>
          nextError.message === appMessages.errors.maxVehiclesCovered ||
          nextError.message === appMessages.errors.maxBeneficiariesCovered
      );

      // Should contain both vehicles exceeded and beneficiaries exceeded error
      // messages
      expect(exceedsErrors.length).toBeGreaterThan(1);
    }
  });

  test("fails if will exceed thresholds", async () => {
    try {
      const { applicationId } = await insertTestApplication({
        // Supply seed to ensure we don't go above the max for subresources
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.minBeneficiariesCount,
          /** seed */ {},
          "valid"
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.minAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.minVehiclesCount
        ),
      });

      const update = {
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.maxBeneficiariesCount
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.maxAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.maxVehiclesCount
        ),
      };

      await callEndpoint<UpdateInsuranceApplicationEndpoint>({
        path: apiPaths.updateInsuranceApplication,
        method: "put",
        body: {
          applicationId,
          add: {
            beneficiaries: update.beneficiaries,
            vehicles: update.vehicles,
          },
        },
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const exceedsErrors = endpointError.filter(
        (nextError) =>
          nextError.message ===
            appMessages.errors.willExceedMaxBeneficiariesCovered(
              validationConstants.maxBeneficiariesCount
            ) ||
          nextError.message ===
            appMessages.errors.willExceedMaxVehiclesCovered(
              validationConstants.maxVehiclesCount
            )
      );

      // Should contain both vehicles exceeded and beneficiaries exceeded error
      // messages
      expect(exceedsErrors.length).toBeGreaterThan(1);
    }
  });

  test("fails if deletes primary beneficiary", async () => {
    try {
      const { applicationId } = await insertTestApplication();
      const existingApplication =
        await callEndpoint<GetInsuranceApplicationEndpoint>({
          path: apiPaths.getInsuranceApplication,
          method: "get",
          query: { applicationId },
        });

      const update = {
        applicationId,
        remove: {
          beneficiaries: existingApplication.beneficiaries
            .filter((beneficiary) => beneficiary.isPrimaryAccountHolder)
            .map((beneficiary) => beneficiary.id),
        },
      } satisfies UpdateInsuranceApplicationEndpointBody;

      await callEndpoint<UpdateInsuranceApplicationEndpoint>({
        path: apiPaths.updateInsuranceApplication,
        method: "put",
        body: update,
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const preconditionErrors = endpointError.filter(
        (nextError) =>
          nextError.message ===
          appMessages.errors.cannotRemovePrimaryBeneficiary
      );
      expect(preconditionErrors.length).toBeGreaterThan(0);
    }
  });

  test("fails if changes primary beneficiary", async () => {
    try {
      const { applicationId } = await insertTestApplication();
      const existingApplication =
        await callEndpoint<GetInsuranceApplicationEndpoint>({
          path: apiPaths.getInsuranceApplication,
          method: "get",
          query: { applicationId },
        });

      const update = {
        applicationId,
        update: {
          beneficiaries: existingApplication.beneficiaries.map((beneficiary) =>
            beneficiary.isPrimaryAccountHolder
              ? {
                  id: beneficiary.id,
                  update: { ...beneficiary, isPrimaryAccountHolder: false },
                }
              : { id: beneficiary.id, update: beneficiary }
          ),
        },
      } satisfies UpdateInsuranceApplicationEndpointBody;

      await callEndpoint<UpdateInsuranceApplicationEndpoint>({
        path: apiPaths.updateInsuranceApplication,
        method: "put",
        body: update,
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const preconditionErrors = endpointError.filter(
        (nextError) =>
          nextError.message ===
          appMessages.errors.cannotChangePrimaryBeneficiary
      );
      expect(preconditionErrors.length).toBeGreaterThan(0);
    }
  });

  test("fails if adding another primary beneficiary", async () => {
    try {
      const { applicationId } = await insertTestApplication({
        // Supply seed to ensure we don't go above the max for subresources
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.minBeneficiariesCount,
          /** seed */ {},
          "valid"
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.minAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.minVehiclesCount
        ),
      });

      const update = {
        applicationId,
        add: {
          beneficiaries: generateTestBeneficiaryList(/** count */ 1, {
            isPrimaryAccountHolder: true,
          }),
        },
      } satisfies UpdateInsuranceApplicationEndpointBody;

      await callEndpoint<UpdateInsuranceApplicationEndpoint>({
        path: apiPaths.updateInsuranceApplication,
        method: "put",
        body: update,
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const preconditionErrors = endpointError.filter(
        (nextError) =>
          nextError.message === appMessages.errors.moreThanOnePrimaryBeneficiary
      );
      expect(preconditionErrors.length).toBeGreaterThan(0);
    }
  });

  test("fails if every vehicle is removed", async () => {
    try {
      const { applicationId } = await insertTestApplication();
      const existingApplication =
        await callEndpoint<GetInsuranceApplicationEndpoint>({
          path: apiPaths.getInsuranceApplication,
          method: "get",
          query: { applicationId },
        });

      const update = {
        applicationId,
        remove: {
          vehicles: existingApplication.vehicles.map((next) => next.id),
        },
      } satisfies UpdateInsuranceApplicationEndpointBody;

      await callEndpoint<UpdateInsuranceApplicationEndpoint>({
        path: apiPaths.updateInsuranceApplication,
        method: "put",
        body: update,
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const preconditionErrors = endpointError.filter(
        (nextError) =>
          nextError.message === appMessages.errors.cannotRemoveEveryVehicle
      );
      expect(preconditionErrors.length).toBeGreaterThan(0);
    }
  });
});
