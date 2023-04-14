import { faker } from "@faker-js/faker";
import { validationConstants } from "../lib/constants";
import {
  AddressInput,
  ApplicationBeneficiaryRelationship,
  BeneficiaryInput,
  InsuranceApplicationInput,
  NewInsuranceApplicationEndpoint,
  VehicleInput,
  apiPaths,
} from "../lib/definitions";
import {
  callEndpoint,
  getApplicationIdFromRoute,
  getRandomIntInclusive,
  indexArray,
} from "../lib/helpers";

export function generateTestVehicle(
  seed: Partial<VehicleInput> = {}
): VehicleInput {
  return {
    make: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.date.past().getFullYear(),
    vin: faker.vehicle.vin(),
    ...seed,
  };
}

export function generateTestBeneficiary(
  seed: Partial<BeneficiaryInput> = {}
): BeneficiaryInput {
  const dob = faker.date.birthdate({ mode: "age", min: 18 });
  dob.setUTCHours(/** hours */ 0, /** mins */ 0, /** secs */ 0, /** ms */ 0);
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    dateOfBirth: dob.toISOString(),
    isPrimaryAccountHolder: faker.datatype.boolean(),
    relationship: faker.helpers.arrayElement(
      Object.values(ApplicationBeneficiaryRelationship)
    ),
    ...seed,
  };
}

export function generateTestAddress(
  seed: Partial<AddressInput> = {}
): AddressInput {
  return {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zipCode: faker.address.zipCode(),
    ...seed,
  };
}

export function generateTestVehicleList(
  count = 3,
  seed: Partial<VehicleInput> = {}
): VehicleInput[] {
  return new Array(count).fill(undefined).map(() => generateTestVehicle(seed));
}

export function generateTestBeneficiaryList(
  count = 3,
  seed: Partial<BeneficiaryInput> = {},

  /** `random` generates random beneficiaries with the seed, and `valid`
   * generates one primary beneficiary and the rest are secondary. */
  type: "random" | "valid" = "random"
): BeneficiaryInput[] {
  if (type === "random") {
    return new Array(count)
      .fill(undefined)
      .map(() => generateTestBeneficiary(seed));
  } else {
    const primaryBeneficiary = generateTestBeneficiary({
      ...seed,
      isPrimaryAccountHolder: true,
    });
    const otherBeneficiaries = new Array(count - 1)
      .fill(undefined)
      .map(() =>
        generateTestBeneficiary({ ...seed, isPrimaryAccountHolder: false })
      );
    return [primaryBeneficiary].concat(otherBeneficiaries);
  }
}

export function generateTestAddressList(
  count = 1,
  seed: Partial<AddressInput> = {}
): AddressInput[] {
  return new Array(count).fill(undefined).map(() => generateTestAddress(seed));
}

export async function insertTestApplication(
  seed: Partial<InsuranceApplicationInput> = {}
) {
  const applicationInput: InsuranceApplicationInput = {
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
    ...seed,
  };
  const result = await callEndpoint<NewInsuranceApplicationEndpoint>({
    path: apiPaths.newInsuranceApplication,
    method: "post",
    body: applicationInput,
  });
  const applicationId = getApplicationIdFromRoute(result.route);
  return { applicationId, applicationInput };
}

export function expectContainsEveryItemInForAnyType<T2, T1>(
  received: T1[],
  expected: T2[],
  receivedIndexer: (item: T1) => string,
  expectedIndexer: (item: T2) => string
) {
  const receivedMap = indexArray(received, { indexer: receivedIndexer });
  expected.forEach((item1) => {
    const k = expectedIndexer(item1);
    const item2 = receivedMap[k];
    expect(item2).toBeTruthy();
  });
}

export function expectContainsExactlyForAnyType<T2, T1>(
  received: T1[],
  expected: T2[],
  receivedIndexer: (item: T1) => string,
  expectedIndexer: (item: T2) => string
) {
  expect(received.length).toEqual(expected.length);
  expectContainsEveryItemInForAnyType(
    received,
    expected,
    receivedIndexer,
    expectedIndexer
  );
}
