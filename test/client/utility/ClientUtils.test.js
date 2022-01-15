import ClientUtils from "../../../src/client/utility/ClientUtils";
import CONSTANTS from "../../../src/client/constants/constants";

jest.mock("node-fetch");

describe("ClientUtils util test container",  () => {
  it("should return query params from url", () => {
    const location = {search: "test-search=test-value"};
    const response = ClientUtils.getQueryParams(location);
    expect(response).toMatchObject({"test-search": "test-value"});
  });

  it("should generate all routes based on passed route config", () => {
    const expected = [
      "/",
      "/users",
      "/brands",
      "/claims",
      "/onboard/company",
      "/onboard/brand",
      "/onboard/review",
      "/users",
      "/brands",
      "/claims",
      "/claims/:claim_id",
      "/profile",
      "/help",
      "/help/faq",
      "/help/user",
      "/help/claim",
      "/help/brand",
      "/help/contact",
      "/dashboard",
    ];
    const response = ClientUtils.getAllValuesFromRecursiveTree(CONSTANTS.ROUTES.PROTECTED)
    expect(response).toMatchObject(expected);
  })
});
