import { isString } from "lodash";
import { NextApiResponse } from "next";
import yup, { InferType } from "yup";
import { apiConstants, appMessages } from "./constants";
import { EndpointError, EndpointResult } from "./definitions";
import { toArray } from "./helpers";

export function toEndpointError(error: unknown): EndpointError[] {
  return toArray(error).map((nextError) => {
    if (isString(nextError)) {
      return { message: nextError };
    } else if (nextError instanceof Error) {
      return { message: nextError.message };
    } else if ("message" in (nextError as Error)) {
      return { message: (nextError as Error).message };
    } else {
      return { message: appMessages.errors.serverError };
    }
  });
}

export function validateReqInput<Schema extends yup.Schema>(
  schema: Schema,
  input: unknown,
  res: NextApiResponse<EndpointResult<any>>
): { validationSuccess: boolean; data?: InferType<Schema> } {
  try {
    const data = schema.validateSync(input);
    return { data, validationSuccess: true };
  } catch (error: unknown) {
    res
      .status(apiConstants.statusCodes.Ok)
      .json({ success: false, error: toEndpointError(error) });
    return { validationSuccess: false };
  }
}
