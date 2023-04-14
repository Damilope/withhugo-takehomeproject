import dayjs from "dayjs";
import * as yup from "yup";
import { validationConstants } from "./constants";
import {
  AddressInput,
  AddressUpdate,
  ApplicationBeneficiaryRelationship,
  BeneficiaryInput,
  BeneficiaryUpdate,
  GetInsuranceApplicationEndpointQuery,
  InsuranceApplicationInput,
  UpdateInsuranceApplicationEndpointBody,
  VehicleInput,
  VehicleUpdate,
} from "./definitions";

// TODO: custom validation messages

const addressParts = {
  street: yup.string().max(validationConstants.streetMaxLength),
  city: yup.string().max(validationConstants.cityMaxLength),
  state: yup.string().max(validationConstants.stateMaxLength),
  zipCode: yup.string().matches(validationConstants.zipCodePattern),
};

const address: yup.ObjectSchema<AddressInput> = yup.object({
  street: addressParts.street.required(),
  city: addressParts.city.required(),
  state: addressParts.state.required(),
  zipCode: addressParts.zipCode.required(),
});

const addressUpdate: yup.ObjectSchema<AddressUpdate> = yup.object(addressParts);

const vehicleParts = {
  vin: yup.string().matches(validationConstants.vinPattern),
  year: yup
    .number()
    .integer()
    .min(validationConstants.minVehicleYear)
    .max(validationConstants.maxVehicleYear),
  make: yup.string().max(validationConstants.makeMaxLength),
  model: yup.string().max(validationConstants.modelMaxLength),
};

const vehicle: yup.ObjectSchema<VehicleInput> = yup.object({
  vin: vehicleParts.vin.required(),
  year: vehicleParts.year.required(),
  make: vehicleParts.make.required(),
  model: vehicleParts.model.required(),
});

const vehicleUpdate: yup.ObjectSchema<VehicleUpdate> = yup.object(vehicleParts);

const beneficiaryParts = {
  firstName: yup.string().max(validationConstants.firstNameMaxLength),
  lastName: yup.string().max(validationConstants.lastNameMaxLength),
  dateOfBirth: yup
    .date()
    .max(
      dayjs()
        .startOf("year")
        .subtract(validationConstants.minAge, "years")
        .toDate()
    ),
  isPrimaryAccountHolder: yup.boolean().nullable(),
  relationship: yup
    .string()
    .oneOf([
      ApplicationBeneficiaryRelationship.Friend,
      ApplicationBeneficiaryRelationship.Other,
      ApplicationBeneficiaryRelationship.Parent,
      ApplicationBeneficiaryRelationship.Sibling,
      ApplicationBeneficiaryRelationship.Spouse,
    ])
    .when("isPrimaryAccountHolder", {
      is: false,
      then: (schema) => schema.nonNullable(),
      otherwise: (schema) => schema.nullable(),
    }),
};

const beneficiary: yup.ObjectSchema<BeneficiaryInput> = yup.object({
  firstName: beneficiaryParts.firstName.required(),
  lastName: beneficiaryParts.lastName.required(),
  dateOfBirth: beneficiaryParts.dateOfBirth.required(),
  isPrimaryAccountHolder: beneficiaryParts.isPrimaryAccountHolder.required(),
  relationship: beneficiaryParts.relationship.required(),
});

const beneficiaryUpdate: yup.ObjectSchema<BeneficiaryUpdate> =
  yup.object(beneficiaryParts);

const insuranceApplicationParts = {
  beneficiaries: yup
    .array()
    .of(beneficiary)
    .min(validationConstants.minBeneficiariesCount)
    .max(validationConstants.maxBeneficiariesCount),
  address: yup
    .array()
    .of(address)
    .min(validationConstants.minAddressCount)
    .max(validationConstants.maxAddressCount),
  vehicles: yup
    .array()
    .of(vehicle)
    .min(validationConstants.minVehiclesCount)
    .max(validationConstants.maxVehiclesCount),
};

const insuranceApplication: yup.ObjectSchema<InsuranceApplicationInput> =
  yup.object({
    beneficiaries: insuranceApplicationParts.beneficiaries.required(),
    address: insuranceApplicationParts.address.required(),
    vehicles: insuranceApplicationParts.vehicles.required(),
  });

const id = yup.number().integer().min(0);
const insuranceApplicationRequired = insuranceApplication.required();
const idRequired = id.required();

const updateApplicationBody: yup.ObjectSchema<UpdateInsuranceApplicationEndpointBody> =
  yup
    .object({
      applicationId: idRequired,
      add: yup.object({
        beneficiaries: insuranceApplicationParts.beneficiaries.min(0),
        vehicles: insuranceApplicationParts.vehicles.min(0),
      }),
      remove: yup.object({
        beneficiaries: yup
          .array()
          .of(idRequired)
          .min(0)
          .max(validationConstants.maxBeneficiariesCount),
        vehicles: yup
          .array()
          .of(idRequired)
          .min(0)
          .max(validationConstants.maxVehiclesCount),
      }),
      update: yup.object({
        beneficiaries: yup
          .array()
          .of(
            yup.object({
              id: idRequired,
              update: beneficiaryUpdate.required(),
            })
          )
          .min(0)
          .max(validationConstants.maxBeneficiariesCount),
        address: yup
          .array()
          .of(
            yup.object({
              id: idRequired,
              update: addressUpdate.required(),
            })
          )
          .min(0)
          .max(validationConstants.maxAddressCount),
        vehicles: yup
          .array()
          .of(
            yup.object({
              id: idRequired,
              update: vehicleUpdate.required(),
            })
          )
          .min(0)
          .max(validationConstants.maxVehiclesCount),
      }),
    })
    .required();

const getApplicationQuery: yup.ObjectSchema<GetInsuranceApplicationEndpointQuery> =
  yup.object({ applicationId: idRequired }).required();

export const validationSchemas = {
  address,
  vehicle,
  beneficiary,
  insuranceApplication,
  id,
  insuranceApplicationRequired,
  idRequired,
  addressParts,
  vehicleParts,
  beneficiaryParts,
  insuranceApplicationParts,
  addressUpdate,
  vehicleUpdate,
  beneficiaryUpdate,
  updateApplicationBody,
  getApplicationQuery,
};
