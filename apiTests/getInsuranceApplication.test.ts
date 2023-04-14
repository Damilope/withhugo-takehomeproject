import assert from "assert";
import { appMessages } from "../lib/constants";
import { GetInsuranceApplicationEndpoint, apiPaths } from "../lib/definitions";
import { callEndpoint, toClientsideError } from "../lib/helpers";
import { insertTestApplication } from "./utils";

describe("getInsuranceApplication", () => {
  test("success", async () => {
    const { applicationId, applicationInput } = await insertTestApplication();
    const application = await callEndpoint<GetInsuranceApplicationEndpoint>({
      path: apiPaths.getInsuranceApplication,
      method: "get",
      query: { applicationId },
    });
    expect(applicationId).toBe(application.id);
    expect(application).toMatchObject(applicationInput);
  });

  test("not found", async () => {
    try {
      await callEndpoint({
        path: apiPaths.getInsuranceApplication,
        method: "get",
        query: {
          /** Using 1 billion cause we are most likely not going to have that
           * much, but if we do, the test will fail. */
          applicationId: 1_000_000_000,
        },
      });
      assert.fail("Application not found error should have been thrown.");
    } catch (error: unknown) {
      const endpointError = toClientsideError(error);
      const notFoundError = endpointError.find(
        (nextError) =>
          nextError.message === appMessages.errors.insuranceApplicationNotFound
      );
      expect(notFoundError).toBeTruthy();
    }
  });
});
