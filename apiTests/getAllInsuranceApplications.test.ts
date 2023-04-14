import {
  GetAllInsuranceApplicationsEndpoint,
  apiPaths,
} from "../lib/definitions";
import { callEndpoint } from "../lib/helpers";
import { insertTestApplication } from "./utils";

describe("getAllInsuranceApplications", () => {
  test("success", async () => {
    const seedApplications = await Promise.all([
      insertTestApplication(),
      insertTestApplication(),
      insertTestApplication(),
    ]);
    const { applications } =
      await callEndpoint<GetAllInsuranceApplicationsEndpoint>({
        path: apiPaths.getAllInsuranceApplications,
        method: "get",
      });

    // Using >= because there'd be more than 3 seeing all tests use the same DB
    expect(applications.length).toBeGreaterThanOrEqual(seedApplications.length);
  });
});
