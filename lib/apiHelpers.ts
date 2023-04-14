import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { apiConstants, appMessages } from "./constants";
import {
  Endpoint,
  EndpointResult,
  GetEndpointMethod,
  GetEndpointResult,
  GetEndpointResultData,
  HttpRequestMethods,
} from "./definitions";
import { ApplicationError, toEndpointError } from "./helpers";

export function checkReqMethod(
  req: NextApiRequest,
  methods: HttpRequestMethods[]
) {
  if (!methods.includes(req.method?.toLowerCase() as HttpRequestMethods)) {
    throw new ApplicationError(
      appMessages.errors.methodNotSupported(req.method as HttpRequestMethods)
    );
  }
}

export function wrapEndpoint<E extends Endpoint<any, any, any, any, any>>(
  fn: (
    req: NextApiRequest
  ) => Promise<GetEndpointResultData<GetEndpointResult<E>>>,
  methods: Array<GetEndpointMethod<E>>
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse<EndpointResult<any>>
  ) => {
    try {
      checkReqMethod(req, methods);
      const result = await fn(req);
      res.status(apiConstants.statusCodes.Ok).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(apiConstants.statusCodes.ServerError).json({
        success: false,
        error: toEndpointError(error),
      });
    }
  };
}

export function validateReqBody<Schema extends yup.Schema>(
  req: NextApiRequest,
  schema: Schema
): yup.InferType<Schema> {
  if (!req.body) throw new ApplicationError(appMessages.errors.emptyRequest);
  if (req.headers["content-type"] !== apiConstants.headers.applicationJson)
    throw new ApplicationError(appMessages.errors.contentTypeNotSupported);

  return schema.validateSync(req.body, { stripUnknown: true });
}

export function validateReqQuery<Schema extends yup.Schema>(
  req: NextApiRequest,
  schema: Schema
): yup.InferType<Schema> {
  if (!req.query) throw new ApplicationError(appMessages.errors.emptyQuery);
  return schema.validateSync(req.query, { stripUnknown: true });
}
