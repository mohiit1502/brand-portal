import {preLoadApiUtil} from "../../../src/client/utility/preLoadApiUtil";
import Http from "../../../src/client/utility/Http";
import dashboardData from "../mocks/dashboardData";

describe("preLoadApiUtil test container", () => {
  it("should load claims", async () => {
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
    const dispatcher = jest.fn();
    await preLoadApiUtil.fetchClaims(dispatcher, "");
    expect(dispatcher).toBeCalled();
  });
  it("should load users", async () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({
      body: {
        content: [{
          firstName: "test-f-name",
          lastName: "test-l-name",
          email: "abc@gmail.com",
          brands: [{name: "test-brand"}],
          status: "ACTIVE",
          role: {name: "test-role"},
          createTs: "20210308T123045",
          type: "thirdparty"
        }]
      }
    }));
    const dispatcher = jest.fn();
    await preLoadApiUtil.fetchUsers(dispatcher, "");
    expect(dispatcher).toBeCalled();
  });

  it("should dispatch local modal config on failure", async () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
    const dispatcher = jest.fn();
    await preLoadApiUtil.fetchModalConfig(dispatcher);
    expect(dispatcher).toBeCalledTimes(2);
  });

  it("should dispatch local form field config on failure", async () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
    const dispatcher = jest.fn();
    await preLoadApiUtil.fetchFormFieldConfig(dispatcher);
    expect(dispatcher).toBeCalledTimes(2);
  });
});
