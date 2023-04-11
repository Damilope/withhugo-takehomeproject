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

  // insurance application
  firstNameMaxLength: 100,
  lastNameMaxLength: 100,
  maxCoveredVehicles: 3,
};

export const apiConstants = {
  statusCodes: {
    Ok: 200,
    ServerError: 500,
  },
};

export const appMessages = {
  errors: {
    serverError: "Server error.",
  },
};

export const frontendRoutes = {};
