import { PrismaClient } from "@prisma/client";
import type { NextApiRequest } from "next";
import { validateReqQuery, wrapEndpoint } from "../../lib/apiHelpers";
import { appMessages } from "../../lib/constants";
import { GetInsuranceApplicationEndpoint } from "../../lib/definitions";
import { ApplicationError } from "../../lib/helpers";
import { validationSchemas } from "../../lib/validation";

const prisma = new PrismaClient();

/**
 * Returns an existing insurance application.
 */
const handler = wrapEndpoint<GetInsuranceApplicationEndpoint>(
  async (req: NextApiRequest) => {
    const data = validateReqQuery(req, validationSchemas.getApplicationQuery);
    const application = await prisma.insuranceApplication.findFirst({
      where: { id: data.applicationId },
      include: { address: true, vehicles: true, beneficiaries: true },
    });

    if (!application) {
      throw new ApplicationError(
        appMessages.errors.insuranceApplicationNotFound
      );
    }

    return application;
  },
  ["get"]
);

export default handler;
