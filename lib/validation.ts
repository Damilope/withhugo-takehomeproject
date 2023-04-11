import yup from "yup";
import { validationConstants } from "./constants";
import { Address, InsuranceApplication, Vehicle } from "./definitions";

const address: yup.ObjectSchema<Address> = yup.object({
  street: yup.string().max(validationConstants.streetMaxLength).required(),
  city: yup.string().max(validationConstants.cityMaxLength).required(),
  state: yup.string().max(validationConstants.stateMaxLength).required(),
  zipCode: yup.string().matches(validationConstants.zipCodePattern).required(),
});

const vehicle: yup.ObjectSchema<Vehicle> = yup.object({
  vin: yup.string().matches(validationConstants.vinPattern).required(),
  year: yup.number().integer().min(0).required(),
  make: yup.string().max(validationConstants.makeMaxLength).required(),
  model: yup.string().max(validationConstants.modelMaxLength).required(),
});

const insuranceApplication: yup.ObjectSchema<InsuranceApplication> = yup.object(
  {
    firstName: yup
      .string()
      .max(validationConstants.firstNameMaxLength)
      .required(),
    lastName: yup
      .string()
      .max(validationConstants.lastNameMaxLength)
      .required(),
    dateOfBirth: yup.date().required(),
    address: address.required(),
    vehicles: yup
      .array()
      .of(vehicle)
      .max(validationConstants.maxCoveredVehicles)
      .required(),
  }
);

const applicationId = yup.string().uuid();
const insuranceApplicationRequired = insuranceApplication.required();
const applicationIdRequired = applicationId.required();

export const validationSchemas = {
  address,
  vehicle,
  insuranceApplication,
  applicationId,
  insuranceApplicationRequired,
  applicationIdRequired,
};
