import type { NextApiRequest } from "next";
import { validateReqBody, wrapEndpoint } from "../../lib/apiHelpers";
import { QuoteInsuranceApplicationEndpoint } from "../../lib/definitions";
import {
  checkNewApplicationBeneficiariesCount,
  getRandomIntInclusive,
} from "../../lib/helpers";
import { validationSchemas } from "../../lib/validation";

const minQuote = 20;
const maxQuote = 100;

/**
 * Validates an insurance application and returns a quote.
 */
const handler = wrapEndpoint<QuoteInsuranceApplicationEndpoint>(
  async (req: NextApiRequest) => {
    const data = validateReqBody(
      req,
      validationSchemas.insuranceApplicationRequired
    );
    checkNewApplicationBeneficiariesCount(data.beneficiaries);
    return { quote: getRandomIntInclusive(minQuote, maxQuote) };
  },
  ["post"]
);

export default handler;
