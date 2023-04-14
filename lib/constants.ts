import { HttpRequestMethods, apiPaths } from "./definitions";

export const validationConstants = {
  // address
  streetMaxLength: 100,
  cityMaxLength: 50,
  stateMaxLength: 50,
  zipCodePattern: /^[0-9-]{5,10}$/,

  // vehicle
  vinPattern: /^[A-Z0-9]{17}$/,
  makeMaxLength: 100,
  modelMaxLength: 100,
  minVehicleYear: 1985,
  maxVehicleYear: new Date().getFullYear() + 1,

  // insurance application
  firstNameMaxLength: 100,
  lastNameMaxLength: 100,
  minVehiclesCount: 1,
  maxVehiclesCount: 3,
  minAddressCount: 1,
  maxAddressCount: 1,
  minBeneficiariesCount: 1,
  maxBeneficiariesCount: 4,

  // beneficiary
  minAge: 16,
};

export const apiConstants = {
  statusCodes: {
    Ok: 200,
    NotFound: 404,
    ServerError: 500,
  },
  headers: {
    contentType: "content-type",
    applicationJson: "application/json",
  },
};

export const appMessages = {
  errors: {
    unknownError: "An unknown error occurred",
    serverError: "Server error.",
    emptyRequest: "Req body is empty",
    emptyQuery: "Req query is empty",
    emptyApplicationId: "Application ID not provided",
    invalidApplicationId: "Invalid application ID provided",
    contentTypeNotSupported: "Request content type not supported",
    methodNotSupported: (method: HttpRequestMethods) =>
      `HTTP method ${method} not supported for this route`,
    insuranceApplicationNotFound: "Insurance application not found",
    maxVehiclesCovered: `Cannot add new vehicles, this insurance policy already covers the maximum allowed, ${validationConstants.maxVehiclesCount} vehicles`,
    willExceedMaxVehiclesCovered: (newCount: number) =>
      `Cannot add new vehicles. Adding ${newCount} new vehicles will exceed this insurance policy's maximum allowed vehicles, ${validationConstants.maxVehiclesCount} vehicles`,
    maxBeneficiariesCovered: `Cannot add new beneficiaries, this insurance policy already covers the maximum allowed, ${validationConstants.maxBeneficiariesCount} beneficiaries`,
    willExceedMaxBeneficiariesCovered: (newCount: number) =>
      `Cannot add new beneficiaries. Adding ${newCount} new beneficiaries will exceed this insurance policy's maximum allowed beneficiaries, ${validationConstants.maxVehiclesCount} beneficiaries`,
    primaryBeneficiaryRequired: "Primary beneficiary required",
    moreThanOnePrimaryBeneficiary:
      "Cannot have more than one primary beneficiary",
    cannotRemovePrimaryBeneficiary: "Cannot remove primary beneficiary",
    cannotChangePrimaryBeneficiary: "Cannot change primary beneficiary",
    cannotRemoveEveryVehicle: "Cannot remove all covered vehicles",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const apiUrl = baseUrl + "/api";
export const frontendRoutes = {
  baseUrl,
  applications: "/applications",
  application(id: string | number) {
    return this.baseUrl + this.applications + "/" + id;
  },
};

export const apiRoutes = {
  apiUrl,
  getInsuranceApplication: apiUrl + apiPaths.getInsuranceApplication,
  getAllInsuranceApplications: apiUrl + apiPaths.getAllInsuranceApplications,
  newInsuranceApplication: apiUrl + apiPaths.newInsuranceApplication,
  updateInsuranceApplication: apiUrl + apiPaths.updateInsuranceApplication,
  quoteInsuranceApplication: apiUrl + apiPaths.quoteInsuranceApplication,
};
