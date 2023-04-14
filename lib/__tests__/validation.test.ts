import assert from "assert";
import { ValidationError } from "yup";
import { validationConstants } from "../constants";
import { validationSchemas } from "../validation";

describe("validation", () => {
  test("fails if beneficiary is below min age", () => {
    const dob = new Date();
    dob.setFullYear(new Date().getFullYear() - validationConstants.minAge + 1);

    try {
      validationSchemas.beneficiaryParts.dateOfBirth.validateSync(dob);
      assert.fail("ValidationError should be thrown");
    } catch (error: unknown) {
      assert(error instanceof ValidationError);
    }
  });

  test("fails if vehicle year is below min year", () => {
    try {
      validationSchemas.vehicleParts.year.validateSync(
        validationConstants.minVehicleYear - 1
      );
      assert.fail("ValidationError should be thrown");
    } catch (error: unknown) {
      assert(error instanceof ValidationError);
    }
  });

  test("fails if vehicle year is above max year", () => {
    try {
      validationSchemas.vehicleParts.year.validateSync(
        validationConstants.maxVehicleYear + 1
      );
      assert.fail("ValidationError should be thrown");
    } catch (error: unknown) {
      assert(error instanceof ValidationError);
    }
  });
});
