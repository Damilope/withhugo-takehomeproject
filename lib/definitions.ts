import type {
  Address,
  Beneficiary,
  InsuranceApplication,
  Vehicle,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface VehicleInput {
  vin: string;
  year: number;
  make: string;
  model: string;
}

export enum ApplicationBeneficiaryRelationship {
  Spouse = "Spouse",
  Sibling = "Sibling",
  Parent = "Parent",
  Friend = "Friend",
  Other = "Other",
}

export interface BeneficiaryInput {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  isPrimaryAccountHolder: boolean | null;
  relationship: string | null;
}

export interface InsuranceApplicationInput {
  beneficiaries: Array<BeneficiaryInput>;

  /** Max of 1. */
  address: Array<AddressInput>;
  vehicles: Array<VehicleInput>;
}

export type AddressUpdate = Partial<AddressInput>;
export type VehicleUpdate = Partial<VehicleInput>;
export type BeneficiaryUpdate = Partial<BeneficiaryInput>;
export type InsuranceApplicationUpdate = Partial<InsuranceApplicationInput>;

// Clientside only types. Primarily for tracking newly added items, updated
// items, and deleted items through their `id`. Newly added items have `id` of
// `undefined`, updated items will retain their `id`, and for deleted items, we
// diff the update and the existing application to find items present in the
// existing not found in the update and collate them as deleted items.
export type ClientsideInputItem<T extends object = {}> = T & { id?: number };
export type ClientsideAddressInput = ClientsideInputItem<AddressInput>;
export type ClientsideVehicleInput = ClientsideInputItem<VehicleInput>;
export type ClientsideBeneficiaryInput = ClientsideInputItem<BeneficiaryInput>;
export type ClientsideInsuranceApplicationInput = {
  beneficiaries: Array<ClientsideBeneficiaryInput>;
  address: Array<ClientsideAddressInput>;
  vehicles: Array<ClientsideVehicleInput>;
};

export interface EndpointError {
  name: string;
  message: string;
  path?: string;
}

export type ClientsideError = Pick<Error, "message"> & { path?: string };

export type EndpointResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: EndpointError[];
    };

export type GetEndpointResultData<R> = R extends EndpointResult<infer V>
  ? V
  : R;

export type AnyObject = { [k: string | number | symbol]: any };
export type HttpRequestMethods = "get" | "post" | "put" | "delete" | "head";
export type CompletePrismaInsuranceApplication = InsuranceApplication & {
  address: Address[];
  vehicles: Vehicle[];
  beneficiaries: Beneficiary[];
};

export type Endpoint<
  Path,
  Method extends HttpRequestMethods,
  Query = never,
  Body = never,
  Result = void
> = ((
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<Result>>
) => Promise<Result>) & {
  /** We need to keep track of the generic arguments, otherwise Typescript will
   * infer them as `unknown`. */
  pathType: Path;
  methodType: Method;
  queryType: Query;
  bodyType: Body;
  resultType: Result;
};

export type GetEndpointPath<E> = E extends Endpoint<
  infer Path,
  any,
  any,
  any,
  any
>
  ? Path
  : never;
export type GetEndpointMethod<E> = E extends Endpoint<
  any,
  infer Method,
  any,
  any,
  any
>
  ? Method
  : never;
export type GetEndpointQuery<E> = E extends Endpoint<
  any,
  any,
  infer Query,
  any,
  any
>
  ? Query
  : never;
export type GetEndpointBody<E> = E extends Endpoint<
  any,
  any,
  any,
  infer Body,
  any
>
  ? Body
  : never;
export type GetEndpointResult<E> = E extends Endpoint<
  any,
  any,
  any,
  any,
  infer Result
>
  ? Result
  : never;

export type GetInsuranceApplicationEndpointResultData =
  CompletePrismaInsuranceApplication;
export type GetInsuranceApplicationEndpointQuery = { applicationId: number };
export type GetAllInsuranceApplicationsEndpointResultData = {
  applications: CompletePrismaInsuranceApplication[];
};
export type NewInsuranceApplicationEndpointBody = InsuranceApplicationInput;
export type NewInsuranceApplicationEndpointResultData = { route: string };
export type QuoteInsuranceApplicationEndpointBody = InsuranceApplicationInput;
export type QuoteInsuranceApplicationEndpointResultData = { quote: number };
export type UpdateInsuranceApplicationEndpointResultData =
  CompletePrismaInsuranceApplication;
export type UpdateInsuranceApplicationEndpointBody = {
  applicationId: number;
  add?: Partial<{
    beneficiaries: Array<BeneficiaryInput>;
    vehicles: Array<VehicleInput>;
  }>;
  remove?: Partial<{
    beneficiaries: Array<number>;
    vehicles: Array<number>;
  }>;
  update?: Partial<{
    beneficiaries: Array<{ id: number; update: BeneficiaryUpdate }>;
    address: Array<{ id: number; update: AddressUpdate }>;
    vehicles: Array<{ id: number; update: VehicleUpdate }>;
  }>;
};

export const apiPaths = {
  getInsuranceApplication: "/getInsuranceApplication" as const,
  getAllInsuranceApplications: "/getAllInsuranceApplications" as const,
  newInsuranceApplication: "/newInsuranceApplication" as const,
  updateInsuranceApplication: "/updateInsuranceApplication" as const,
  quoteInsuranceApplication: "/quoteInsuranceApplication" as const,
};

export type GetInsuranceApplicationEndpoint = Endpoint<
  typeof apiPaths["getInsuranceApplication"],
  "get",
  GetInsuranceApplicationEndpointQuery,
  never,
  GetInsuranceApplicationEndpointResultData
>;
export type GetAllInsuranceApplicationsEndpoint = Endpoint<
  typeof apiPaths["getAllInsuranceApplications"],
  "get",
  never,
  never,
  GetAllInsuranceApplicationsEndpointResultData
>;
export type NewInsuranceApplicationEndpoint = Endpoint<
  typeof apiPaths["newInsuranceApplication"],
  "post",
  never,
  NewInsuranceApplicationEndpointBody,
  NewInsuranceApplicationEndpointResultData
>;
export type QuoteInsuranceApplicationEndpoint = Endpoint<
  typeof apiPaths["quoteInsuranceApplication"],
  "post",
  never,
  QuoteInsuranceApplicationEndpointBody,
  QuoteInsuranceApplicationEndpointResultData
>;
export type UpdateInsuranceApplicationEndpoint = Endpoint<
  typeof apiPaths["updateInsuranceApplication"],
  "put",
  never,
  UpdateInsuranceApplicationEndpointBody,
  UpdateInsuranceApplicationEndpointResultData
>;
