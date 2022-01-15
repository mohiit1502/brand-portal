import Immutable from "immutable";
import Cookies from "electrode-cookies";
import Http from "../../../src/client/utility/Http";
import {mockFetch} from "../../../src/client/utility/TestingUtils";

jest.mock("node-fetch");
jest.mock("electrode-cookies");

describe("Http util test container",  () => {
  it("tests Http's crud methods", async () => {
    mockFetch();
    await Http.get("/test", {}, () => {}, () => {}, "test", "test");
    mockFetch({headers: Immutable.Map({"content-type": ["text/html"]})})
    await Http.put("/test", {}, {}, () => {});
    expect(Http.put).not.toThrow();
    await Http.post("/test", {}, {}, () => {});
    expect(Http.post).not.toThrow();
    await Http.postAsFormData("/test", {}, () => {});
    expect(Http.postAsFormData).not.toThrow();
    await Http.delete("/test", {}, () => {});
    expect(Http.delete).not.toThrow();
  });

  it("should logout user session", async () => {
    Cookies.expire.mockImplementation(jest.fn());
    mockFetch({ok: false, status: 404});
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({status: 200, body: ""}))
    await expect(() => Http.crud("/userInfo", {}, () => {}, () => {},
      "", "test-failed", () => {}).json()).toThrow();
    Http.logout("test")
  });

  it("should throw error if response is not OK", async () => {
    mockFetch({ok: false, status: 520});
    await expect(() => Http.crud("/test", {}, () => {}, () => {},
      "test", "test-failed", () => {}).json()).toThrow();
    mockFetch({ok: false, status: 500});
    await expect(() => Http.crud("/test", {}, () => {}, () => {},
      "", "test").json()).toThrow();
    mockFetch({ok: false, status: 401});
    await expect(() => Http.crud("/test", {}, () => {}, () => {},
      "", "test").json()).toThrow();
    mockFetch({ok: false, status: 429});
    await expect(() => Http.crud("/test", {}, () => {}, () => {},
      "test", "test").json()).toThrow();
  });
});
