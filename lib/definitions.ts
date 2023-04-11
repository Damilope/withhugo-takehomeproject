export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Vehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
}

export interface InsuranceApplication {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  vehicles: Array<Vehicle>;
}

export interface EndpointError {
  message: string;
  path?: string;
}

export type EndpointResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: EndpointError[];
    };
