import assert from "assert";
import crossfetch from "cross-fetch";
import { flatten, get, isObject, isString, last } from "lodash";
import querystring from "querystring";
import { ValidationError } from "yup";
import { apiConstants, apiRoutes, appMessages } from "./constants";
import {
  AddressInput,
  ApplicationBeneficiaryRelationship,
  BeneficiaryInput,
  ClientsideBeneficiaryInput,
  ClientsideInsuranceApplicationInput,
  CompletePrismaInsuranceApplication,
  Endpoint,
  EndpointError,
  EndpointResult,
  GetEndpointBody,
  GetEndpointMethod,
  GetEndpointPath,
  GetEndpointQuery,
  GetEndpointResult,
  GetEndpointResultData,
  InsuranceApplicationInput,
  UpdateInsuranceApplicationEndpointBody,
  VehicleInput,
} from "./definitions";

export class ApplicationError extends Error {
  name = "ApplicationError";
  statusCode = apiConstants.statusCodes.ServerError;

  /** For validation errors. */
  path?: string;
}

export function toArray<T>(...args: Array<T | T[]>) {
  const arrays = args.map((item) => {
    if (Array.isArray(item)) {
      return item;
    } else {
      return [item];
    }
  });
  return flatten(arrays);
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getApplicationIdFromRoute(route: string) {
  const applicationId = last(route.split("/"));
  assert(applicationId);
  return parseInt(applicationId);
}

export function toEndpointError(
  error: unknown,
  defaultErrorMessage = appMessages.errors.serverError
): EndpointError[] {
  return toArray(error).map((nextError) => {
    if (isString(nextError)) {
      return { name: ApplicationError.name, message: nextError };
    } else if (
      nextError instanceof ApplicationError ||
      (nextError && (nextError as Error).name === ApplicationError.name) ||
      nextError instanceof ValidationError
    ) {
      return {
        name: (nextError as Error).name,
        message: (nextError as Error).message,
        path: (nextError as ValidationError).path,
      };
    }

    return {
      name: ApplicationError.name,
      message: defaultErrorMessage,
    };
  });
}

export function toClientsideError(
  error: unknown,
  defaultErrorMessage = appMessages.errors.unknownError
): Array<Pick<Error, "message"> & Pick<ApplicationError, "path">> {
  return toArray(error).map((nextError) => {
    if (isString(nextError)) {
      return new Error(nextError);
    } else if ("message" in (nextError as Error)) {
      return nextError as Error;
    }

    return new Error(defaultErrorMessage);
  });
}

export function newAddressInput(): AddressInput {
  return {
    street: "",
    state: "",
    city: "",
    zipCode: "",
  };
}

export function newVehicleInput(): VehicleInput {
  return {
    vin: "",
    year: 0,
    make: "",
    model: "",
  };
}

export function newBeneficiaryInput(
  isPrimaryAccountHolder: boolean
): BeneficiaryInput {
  return {
    isPrimaryAccountHolder,
    relationship: ApplicationBeneficiaryRelationship.Other,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  };
}

export function newInsuranceApplicationInput(): InsuranceApplicationInput {
  return {
    beneficiaries: [newBeneficiaryInput(/** isPrimaryAccountHolder */ true)],
    address: [newAddressInput()],
    vehicles: [newVehicleInput()],
  };
}

export async function callEndpoint<
  E extends Endpoint<any, any, any, any, any>
>(props: {
  path: GetEndpointPath<E>;
  method: GetEndpointMethod<E>;
  query?: GetEndpointQuery<E>;
  body?: GetEndpointBody<E>;
}): Promise<GetEndpointResultData<GetEndpointResult<E>>> {
  const path = props.path as string;
  let url = apiRoutes.apiUrl + path;
  if (props.query) url = url + "?" + querystring.encode(props.query);

  const result = await crossfetch(url, {
    body: props.body ? JSON.stringify(props.body) : undefined,
    method: props.method,
    headers: {
      [apiConstants.headers.contentType]: apiConstants.headers.applicationJson,
    },
  });

  const jsonResult =
    result.headers
      .get(apiConstants.headers.contentType)
      ?.includes(apiConstants.headers.applicationJson) && (await result.json());

  if (result.ok) {
    assert(jsonResult);
    const endpointResult = jsonResult as EndpointResult<unknown>;
    assert("success" in endpointResult);

    if (endpointResult.success === false) throw endpointResult.error;
    return endpointResult.data as GetEndpointResultData<GetEndpointResult<E>>;
  }

  if (jsonResult) {
    const errorResult = jsonResult as EndpointResult<any>;
    if (errorResult.success === false) throw errorResult.error;
  }

  throw result.statusText;
}

function defaultIndexer(data: any, path: any) {
  if (path) return get(data, path);
  if (data.toString) return data.toString();
  return String(data);
}

function defaultReducer(data: any) {
  return data;
}

type GetPathType<T> = T extends { [key: string]: any } ? keyof T : undefined;

export interface IIndexArrayOptions<T, R> {
  path?: GetPathType<T>;
  indexer?: (
    current: T,
    path: GetPathType<T>,
    arr: T[],
    index: number
  ) => string;
  reducer?: (current: T, arr: T[], index: number) => R;
}

export function indexArray<T, R = T>(
  arr: T | T[] = [],
  opts: IIndexArrayOptions<T, R> = {}
): { [key: string]: R } {
  const array = toArray(arr ?? []);
  const indexer = opts.indexer ?? defaultIndexer;
  const path = opts.path;
  const reducer = opts.reducer ?? defaultReducer;
  if (typeof indexer !== "function") {
    if (typeof path !== "string") {
      throw new Error("Path must be provided if an indexer is not provided");
    }
  }

  const result = array.reduce((accumulator, current, index) => {
    const key = indexer(current, path as any, array, index);
    accumulator[key] = reducer(current, array, index);
    return accumulator;
  }, {} as { [key: string]: R });

  return result;
}

export function makeObjectIndexer<T>(
  fields: Array<
    | keyof T
    | {
        field: keyof T;
        lowercase?: boolean;
        transform?: (data: any) => string;
      }
  >,
  separator = "__"
) {
  return (item: T) => {
    return fields
      .map((nextField) => {
        if (isObject(nextField)) {
          const { field, lowercase, transform } = nextField;
          const value = item[field];
          let processed: any = value;
          if (lowercase && (value as string | undefined)?.toLowerCase)
            processed = (value as string).toLowerCase();
          if (transform) processed = transform(processed);
          return processed;
        } else {
          return item[nextField];
        }
      })
      .join(separator);
  };
}

export function findPrimaryBeneficiary<
  T extends Pick<BeneficiaryInput, "isPrimaryAccountHolder">
>(beneficiaries: Array<T>) {
  return beneficiaries.find(
    (beneficiary) => beneficiary.isPrimaryAccountHolder
  );
}

export function findById<T extends { id: number }>(items: T[], id: number) {
  return items.find((nextItem) => nextItem.id === id);
}

export function findRemovedItems<T extends { id?: number }>(
  existingItems: T[],
  newItems: T[]
) {
  const newItemsMap = indexArray(newItems, {
    indexer: (item) => String(item.id ?? ""),
  });
  return existingItems.filter((item) =>
    item.id ? !newItemsMap[item.id.toString()] : false
  );
}

export const addressInputIndexer = makeObjectIndexer<AddressInput>([
  { field: "street", lowercase: true },
  { field: "state", lowercase: true },
  { field: "city", lowercase: true },
  "zipCode",
]);
export const beneficiaryInputIndexer = makeObjectIndexer<BeneficiaryInput>([
  { field: "firstName", lowercase: true },
  { field: "lastName", lowercase: true },
  { field: "relationship", lowercase: true },
  { field: "dateOfBirth", transform: (dob) => new Date(dob).toISOString() },
  "isPrimaryAccountHolder",
]);
export const vehicleInputIndexer = makeObjectIndexer<VehicleInput>([
  { field: "make", lowercase: true },
  { field: "model", lowercase: true },
  "vin",
  "year",
]);

export function isEqualAddress(
  address01: AddressInput,
  address02: AddressInput
) {
  return addressInputIndexer(address01) === addressInputIndexer(address02);
}

export function isEqualVehicle(
  vehicle01: VehicleInput,
  vehicle02: VehicleInput
) {
  return vehicleInputIndexer(vehicle01) === vehicleInputIndexer(vehicle02);
}

export function isEqualBeneficiary(
  beneficiary01: BeneficiaryInput,
  beneficiary02: BeneficiaryInput
) {
  return (
    beneficiaryInputIndexer(beneficiary01) ===
    beneficiaryInputIndexer(beneficiary02)
  );
}

export function toUpdateApplicationBody(
  existingApplication: CompletePrismaInsuranceApplication,
  input: ClientsideInsuranceApplicationInput
): UpdateInsuranceApplicationEndpointBody {
  const newVehicleList = input.vehicles.filter((next) => !next.id);
  const newBeneficiaryList = input.beneficiaries.filter((next) => !next.id);

  const deletedVehicleList = findRemovedItems(
    existingApplication.vehicles,
    input.vehicles
  ).map((item) => item.id!);
  const deletedBeneficiaryList = findRemovedItems(
    existingApplication.beneficiaries as ClientsideBeneficiaryInput[],
    input.beneficiaries
  ).map((item) => item.id!);

  const existingAddressMap = indexArray(existingApplication.address, {
    path: "id",
  });
  const existingVehiclesMap = indexArray(existingApplication.vehicles, {
    path: "id",
  });
  const existingBeneficiariesMap = indexArray(
    existingApplication.beneficiaries,
    { path: "id" }
  );

  const updatedAddressList = input.address.filter((addressInput) => {
    if (!addressInput.id) return false;
    const existingAddress = existingAddressMap[addressInput.id];
    assert(existingAddress);
    return !isEqualAddress(existingAddress, addressInput);
  });
  const updatedVehicleList = input.vehicles.filter((vehicleInput) => {
    if (!vehicleInput.id) return false;
    const existingVehicle = existingVehiclesMap[vehicleInput.id];
    assert(existingVehicle);
    return !isEqualVehicle(existingVehicle, vehicleInput);
  });
  const updatedBeneficiaryList = input.beneficiaries.filter(
    (beneficiaryInput) => {
      if (!beneficiaryInput.id) return false;
      const existingBeneficiary = existingBeneficiariesMap[beneficiaryInput.id];
      assert(existingBeneficiary);
      return !isEqualBeneficiary(existingBeneficiary, beneficiaryInput);
    }
  );

  return {
    applicationId: existingApplication.id,
    add: {
      beneficiaries: newBeneficiaryList,
      vehicles: newVehicleList,
    },
    update: {
      address: updatedAddressList.map((next) => ({
        id: next.id!,
        update: next,
      })),
      beneficiaries: updatedBeneficiaryList.map((next) => ({
        id: next.id!,
        update: next,
      })),
      vehicles: updatedVehicleList.map((next) => ({
        id: next.id!,
        update: next,
      })),
    },
    remove: {
      beneficiaries: deletedBeneficiaryList,
      vehicles: deletedVehicleList,
    },
  };
}

export function checkFieldPresent<T extends object>(data: T, field: keyof T) {
  return field in data;
}

export function checkNewApplicationBeneficiariesCount(
  beneficiaries: BeneficiaryInput[]
) {
  const primaryBeneficiariesCount = beneficiaries.filter(
    (beneficiary) => beneficiary.isPrimaryAccountHolder
  ).length;

  if (primaryBeneficiariesCount === 0) {
    throw new ApplicationError(appMessages.errors.primaryBeneficiaryRequired);
  } else if (primaryBeneficiariesCount > 1) {
    throw new ApplicationError(
      appMessages.errors.moreThanOnePrimaryBeneficiary
    );
  }
}
