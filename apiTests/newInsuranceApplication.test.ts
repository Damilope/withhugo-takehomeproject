import assert from "assert";
import { appMessages, validationConstants } from "../lib/constants";
import {
  InsuranceApplicationInput,
  NewInsuranceApplicationEndpoint,
  apiPaths,
} from "../lib/definitions";
import {
  callEndpoint,
  getApplicationIdFromRoute,
  getRandomIntInclusive,
  toClientsideError,
} from "../lib/helpers";
import {
  generateTestAddressList,
  generateTestBeneficiaryList,
  generateTestVehicleList,
} from "./utils";

describe("newInsuranceApplication", () => {
  test("success", async () => {
    const input: InsuranceApplicationInput = {
      beneficiaries: generateTestBeneficiaryList(
        /** count */ 1,
        /** seed */ {},
        "valid"
      ),
      address: generateTestAddressList(
        /** count */ getRandomIntInclusive(
          validationConstants.minAddressCount,
          validationConstants.maxAddressCount
        )
      ),
      vehicles: generateTestVehicleList(
        /** count */ getRandomIntInclusive(
          validationConstants.minVehiclesCount,
          validationConstants.maxVehiclesCount
        )
      ),
    };
    const result = await callEndpoint<NewInsuranceApplicationEndpoint>({
      path: apiPaths.newInsuranceApplication,
      method: "post",
      body: input,
    });
    const applicationId = getApplicationIdFromRoute(result.route);
    expect(applicationId).toBeTruthy();
  });

  test("exceeds thresholds", async () => {
    try {
      const input: InsuranceApplicationInput = {
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.maxBeneficiariesCount * 2,
          /** seed */ {},
          "valid"
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.maxAddressCount * 2
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.maxVehiclesCount * 2
        ),
      };
      await callEndpoint<NewInsuranceApplicationEndpoint>({
        path: apiPaths.newInsuranceApplication,
        method: "post",
        body: input,
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const validationErrors = endpointError.filter(
        (nextError) => !!nextError.path
      );
      expect(validationErrors.length).toBeGreaterThan(0);
    }
  });

  test("no primary beneficiary", async () => {
    try {
      const input: InsuranceApplicationInput = {
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.minBeneficiariesCount,
          { isPrimaryAccountHolder: false }
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.minAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.minVehiclesCount
        ),
      };
      await callEndpoint<NewInsuranceApplicationEndpoint>({
        path: apiPaths.newInsuranceApplication,
        method: "post",
        body: input,
      });
      assert.fail("Application validation error(s) should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const preconditionErrors = endpointError.filter(
        (nextError) =>
          nextError.message === appMessages.errors.primaryBeneficiaryRequired
      );
      expect(preconditionErrors.length).toBeGreaterThan(0);
    }
  });

  test("more than one primary beneficiary", async () => {
    try {
      const input: InsuranceApplicationInput = {
        beneficiaries: generateTestBeneficiaryList(
          /** count */ validationConstants.maxBeneficiariesCount,
          { isPrimaryAccountHolder: true }
        ),
        address: generateTestAddressList(
          /** count */ validationConstants.minAddressCount
        ),
        vehicles: generateTestVehicleList(
          /** count */ validationConstants.minVehiclesCount
        ),
      };
      await callEndpoint<NewInsuranceApplicationEndpoint>({
        path: apiPaths.newInsuranceApplication,
        method: "post",
        body: input,
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
});
