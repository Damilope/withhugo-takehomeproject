import type { NextApiRequest, NextApiResponse } from "next";
import { validateReqInput } from "../../lib/apiHelpers";
import { EndpointResult, InsuranceApplication } from "../../lib/definitions";
import { validationSchemas } from "../../lib/validation";

export type GetInsuranceApplicationEndpointResult =
  EndpointResult<InsuranceApplication>;

/**
 * query:
 * - `applicationId` - Insurance application ID, `string`.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetInsuranceApplicationEndpointResult>
) {
  const { validationSuccess, data } = validateReqInput(
    validationSchemas.applicationIdRequired,
    req.query.applicationId,
    res
  );

  if (!validationSuccess) return;
}
