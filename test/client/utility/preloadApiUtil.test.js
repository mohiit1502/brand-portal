import {preLoadApiUtil} from "../../../src/client/utility/preLoadApiUtil";
import Http from "../../../src/client/utility/Http";
import dashboardData from "../mocks/dashboardData";

describe("preLoadApiUtil test container", () => {
  it("should load claims", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({
      body: {
        data: {
          content: [{
            firstName: "test-f-name",
            lastName: "test-l-name",
            email: "abc@gmail.com",
            brands: [],
            status: "ACTIVE",
            role: {name: "test-role"},
            type: "thirdparty"
          }]
        }
      }
    }));
    preLoadApiUtil.fetchClaims(jest.fn(), "");
  });
});
