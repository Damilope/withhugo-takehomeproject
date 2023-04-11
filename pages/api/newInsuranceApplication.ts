import type { NextApiRequest, NextApiResponse } from "next";
import { validateReqInput } from "../../lib/apiHelpers";
import { EndpointResult } from "../../lib/definitions";
import { validationSchemas } from "../../lib/validation";

export type NewInsuranceApplicationEndpointResult = EndpointResult<{
  route: string;
}>;

/**
 * body:
 * - Insurance application, `{@link InsuranceApplication}`
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewInsuranceApplicationEndpointResult>
) {
  const { validationSuccess, data } = validateReqInput(
    validationSchemas.insuranceApplicationRequired,
    req.body,
    res
  );

  if (!validationSuccess) return;
}
