import { PrismaClient } from "@prisma/client";
import type { NextApiRequest } from "next";
import { validateReqBody, wrapEndpoint } from "../../lib/apiHelpers";
import { frontendRoutes } from "../../lib/constants";
import { NewInsuranceApplicationEndpoint } from "../../lib/definitions";
import { checkNewApplicationBeneficiariesCount } from "../../lib/helpers";
import { validationSchemas } from "../../lib/validation";

const prisma = new PrismaClient();

/**
 * Inserts a new insurance application.
 */
const handler = wrapEndpoint<NewInsuranceApplicationEndpoint>(
  async (req: NextApiRequest) => {
    const data = validateReqBody(
      req,
      validationSchemas.insuranceApplicationRequired
    );

    checkNewApplicationBeneficiariesCount(data.beneficiaries);
    const application = await prisma.insuranceApplication.create({
      data: {
        beneficiaries: {
          create: data.beneficiaries.map((next) => ({
            ...next,
            dateOfBirth: new Date(next.dateOfBirth),
          })),
        },
        address: { create: data.address },
        vehicles: { create: data.vehicles },
      },
    });

    return { route: frontendRoutes.application(application.id) };
  },
  ["post"]
);

export default handler;
