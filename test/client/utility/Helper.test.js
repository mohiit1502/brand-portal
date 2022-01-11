import jQuery from "jquery";
import fetch from "node-fetch";
import Helper from "../../../src/client/utility/helper";
import dummyThis from "../mocks/dummyThis";
import currentFilters from "../mocks/currentFilters";
import Http from "../../../src/client/utility/Http";
import dashboardData from "../mocks/dashboardData";
import {setupFetchThrowStub} from "../../../src/client/utility/TestingUtils";
import userProfile from "../mocks/userProfile";
const parentObj = dummyThis;

jest.mock("node-fetch");

describe("helper util test container", () => {
  afterEach(() => {
    jest.useRealTimers();
  })
  it("should convert string to camel case with first letter uppercase",  () => {
    let response = Helper.toCamelCaseFirstUpper("abc-def");
    expect(response).toBe("AbcDef");
    response = Helper.toCamelCaseFirstUpper();
    expect(response).toBe("");
    response = Helper.toCamelCaseFirstUpper("abcdef");
    expect(response).toBe("Abcdef");
  });

  it("should convert string to camel case", () => {
    let response = Helper.toCamelCaseFirstUpper();
    expect(response).toBe("");
  });

  it("searches for dot separated path in object", () => {
    let response = Helper.search("CODES.ERRORCODES.FORBIDDEN");
    expect(response).toBe("403");
    response = Helper.search("", parentObj);
    expect(response).toBe(parentObj);
    response = Helper.search("CONSTANTS.CODES.ERRORCODES.FORBIDDEN");
    expect(response).toBe("403");
    response = Helper.search("a.b.c[2].d", {a: {b: {c: [{}, {}, {d: "xyz"}]}}});
    expect(response).toBe("xyz");
    response = Helper.search("a.b.c.d.d", {a: {b: {c: [{}, {}, {d: "xyz"}]}}}, "xyz");
    expect(response).toBe("xyz");
    response = Helper.search("a.b.c", parentObj);
    expect(response).toBe("");
  });

  it("should set the loader", () => {
    parentObj.setState = callback => callback && callback(parentObj.state);
    Helper.loader.call(parentObj, "test", true);
    expect(parentObj.state.form.inputData.brandName.loader).toBeUndefined();
    Helper.loader.call(parentObj, "form.inputData.brandName", true);
    expect(parentObj.state.form.inputData.brandName.loader).toBe(true);
  });

  it("should change hyphen based string to camel case", () => {
    let response = Helper.toCamelCase();
    expect(response).toBe("");
    response = Helper.toCamelCase("abc-def-ghi");
    expect(response).toBe("abcDefGhi");
    response = Helper.toCamelCase("abcdefghi");
    expect(response).toBe("Abcdefghi");
  });

  it("should change each word to camel case", () => {
    let response = Helper.toCamelCaseEach();
    expect(response).toBe("");
    response = Helper.toCamelCaseEach("abc def ghi");
    expect(response).toBe("Abc Def Ghi");
    response = Helper.toCamelCaseEach("abcdefghi");
    expect(response).toBe("Abcdefghi");
  });

  it("should change single word to camel case", () => {
    let response = Helper.toCamelCaseIndividual();
    expect(response).toBe("");
    response = Helper.toCamelCaseIndividual("a");
    expect(response).toBe("A");
    response = Helper.toCamelCaseIndividual("abcdefghi", true);
    expect(response).toBe("abcdefghi");
    response = Helper.toCamelCaseIndividual("abcdefghi");
    expect(response).toBe("Abcdefghi");
  });

  it("should execute contained debounce function", async () => {
    jest.useFakeTimers();
    jest.spyOn(window, "setTimeout");
    const debouncedFunc = Helper.debounce(jest.fn(), 100);
    debouncedFunc();
    jest.runAllTimers();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
  });

  it("should terminate long string with ellipsis", () => {
    let items = [];
    window.Element.prototype.getComputedTextLength = function() {
      return 200
    }
    jQuery.each( [1, 2, 3, 4], function() {
      items.push(jQuery('<div>1123</div>').get(0));
    });
    Helper.wrap(jQuery(items), 30);
  });

  it("should update D3 chart", () => {
    let getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: dashboardData}));
    const filters = currentFilters;
    const meta = {};
    meta.filters = [
      {
        "classes": "col-6 pl-375",
        "name": "claimType",
        "placeholder": "Claim Type",
        "backendMapper": {
          "all": "__claimType__",
          "trademark": "Trademark",
          "patent": "Patent",
          "counterfeit": "Counterfeit",
          "copyright": "Copyright"
        }
      }
    ];
    meta.setLoader = jest.fn();
    meta.setDataLocal = jest.fn();
    meta.API = "/api/dashboard/__orgId__/__emailId__/__role__/__test__";
    Helper.updateChart(filters['widget-claims-by-brand'], meta);
    getter = jest.spyOn(Http, "get").mockImplementation(setupFetchThrowStub);
    Helper.updateChart(filters['widget-claims-by-brand'], meta);
    getter.mockRestore();
    fetch.mockImplementation(setupFetchThrowStub);
    Helper.updateChart(filters['widget-claims-by-brand'], meta);
  });

  it("should encode arguments", () => {
    let response = Helper.getParamsEncoded("/api/dashboard/topReporters/__orgId__/__emailId__/__role__/__dateRange__/__claimType__", userProfile);
    expect(response).toBe("/api/dashboard/topReporters/b3JnSWQ6NjQwYTIwYzItM2JiZC00NmU1LTlhODEtNGY5N2M4YmM5ZjA4L2VtYWlsSWQ6d20ucm9wcm8uc3RnK2RlbW9AZ21haWwuY29tL3JvbGU6U3VwZXIgQWRtaW4vX19kYXRlUmFuZ2VfXy9fX2NsYWltVHlwZV9f");
    response = Helper.getParamsEncoded("/api/dashboard/topReporters", userProfile);
    expect(response).toBe("/api/dashboard/topReporters");
  });

  it("should trim more than 1 spaces", () => {
    let response = Helper.trimSpaces("   test     ");
    expect(response).toBe("test ");
    response = Helper.trimSpaces({target: {value: "    test    abc   "}})
    expect(response).toBe("test abc ")
  });

  it("should convert timestamp to date", () => {
    let response = Helper.getDateFromTimeStamp("20170701T1459557");
    expect(response).toBe("07-01-2017");
    response = Helper.getDateFromTimeStamp();
    expect(response).toBe("");
  })

});
