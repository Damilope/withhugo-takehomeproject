import type { NextApiRequest, NextApiResponse } from "next";
import yup from "yup";
import { validateReqInput } from "../../lib/apiHelpers";
import { EndpointResult, InsuranceApplication } from "../../lib/definitions";
import { validationSchemas } from "../../lib/validation";

export type UpdateInsuranceApplicationEndpointResult = EndpointResult<{
  route: string;
}>;
export type UpdateInsuranceApplicationEndpointParams = {
  applicationId: string;
  application: InsuranceApplication;
};

const reqValidationSchema: yup.ObjectSchema<UpdateInsuranceApplicationEndpointParams> =
  yup.object({
    applicationId: validationSchemas.applicationIdRequired,
    application: validationSchemas.insuranceApplicationRequired,
  });

/**
 * body:
 * - Insurance application, `{@link InsuranceApplication}`
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateInsuranceApplicationEndpointResult>
) {
  const { validationSuccess, data } = validateReqInput(
    reqValidationSchema,
    req.body,
    res
  );

  if (!validationSuccess) return;
}
