import { PrismaClient } from "@prisma/client";
import { wrapEndpoint } from "../../lib/apiHelpers";
import { GetAllInsuranceApplicationsEndpoint } from "../../lib/definitions";

const prisma = new PrismaClient();

/**
 * Returns all insurance applications.
 */
const handler = wrapEndpoint<GetAllInsuranceApplicationsEndpoint>(async () => {
  const applications = await prisma.insuranceApplication.findMany({
    include: { address: true, vehicles: true, beneficiaries: true },
  });
  return { applications };
}, ["get"]);

export default handler;
