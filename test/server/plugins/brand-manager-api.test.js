/* eslint-disable  no-console */
import ServerHttp from "../../../src/server/utility/ServerHttp";
import ServerUtils from "../../../src/server/utility/server-utils";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import jest from "jest";
import Hapi from "hapi";
import successResponse from "./../mocks/success-response.json";
import headerResponse from "./../mocks/headers-response.json";
import failureResponseWithErrorMessage from "../mocks/failure-response-with-error-message.json";
import failureResponseWithoutErrorMessage from "../mocks/failure-response-without-error-message.json";
import classUnderTest from "./../../../src/server/plugins/brand/brand-manager-api";
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";


configure({ adapter: new Adapter() });

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod;

jest.mock("/secrets/secrets.json", ()=>({
  secrets: 'Test Secrets'
}), { virtual: true });

const setUp = () => {
  server = new Hapi.Server();
  getHeadersMethod = jest.spyOn(ServerUtils,"getHeaders")
    .mockResolvedValueOnce(headerResponse);
  ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
    .mockResolvedValueOnce("https://test.com")
    .mockResolvedValueOnce("/test");
  mixPanelTrackEventMethod = jest.spyOn(mixpanel,"trackEvent").mockImplementationOnce(() => {
    console.log("This is mock mixpanel implementation");
  });
  server.register(classUnderTest);
};

const endPoints = [
  {
    functionName : "Get Brands with parameters",
    method : "GET",
    url: "/api/brands?brandStatus=ACCEPTED"
  },
  {
    functionName : "Get Brands without parameters",
    method : "GET",
    url: "/api/brands"
  },
  {
    functionName : "Create Brands",
    method : "POST",
    url: "/api/brands",
    payload: {
      testPayload: "This is test payload"
    }
  },
  {
    functionName : "Check Brand Uniqueness",
    method : "GET",
    url: "/api/brands/checkUnique?brandName=TESTBRAND"
  },
  {
    functionName : "Update Brand",
    method : "PUT",
    url: "/api/brands/{brandId}"
  }

]

describe("Test Brand Manager API",() => {

  describe("Brand Api Successful",() => {
    beforeEach(()=>{
      setUp();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    endPoints.forEach((endPoint) => {
      it(endPoint.functionName + " Successful",(done) => {
        const request = {
          method: endPoint.method,
          url: endPoint.url,
          payload: endPoint.payload
        };
        serverHttpMethod = jest.spyOn(ServerHttp,endPoint.method.toLowerCase())
          .mockResolvedValue(successResponse);
        server.inject(request).then(res => {
          expect(getHeadersMethod).toHaveBeenCalled();
          expect(ccmGetMethod).toBeCalledTimes(2);
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(200);
          expect(JSON.parse(res.payload)).toEqual(successResponse.body);
          done();
        }).catch(() => {
          expect(true).toBe(false);
          done();
        });
      });
    });
  });

  describe("Brand APIs failure with error message",() => {
    beforeEach(()=>{
      setUp();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    endPoints.forEach(endPoint => {
      it(endPoint.functionName + " failure with error message",(done) => {
        const request = {
          method: endPoint.method,
          url: endPoint.url,
          payload: endPoint.payload
        };
        serverHttpMethod = jest.spyOn(ServerHttp,endPoint.method.toLowerCase())
        .mockImplementation(() => {
          throw new ServerHttpError(500, "Test Error", "This is a test error message");
        });
        server.inject(request).then(res => {
          expect(getHeadersMethod).toHaveBeenCalled();
          expect(ccmGetMethod).toBeCalledTimes(2);
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
          done();
        });
      });
    });
  });

  describe("Brand APIs failure without error message",() => {
    beforeEach(()=>{
      setUp();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    endPoints.forEach(endPoint => {
      it(endPoint.functionName + " failure without error message",(done) => {
        const request = {
          method: endPoint.method,
          url: endPoint.url,
          payload: endPoint.payload
        };
        serverHttpMethod = jest.spyOn(ServerHttp,endPoint.method.toLowerCase())
          .mockImplementation(() => {
            throw new ServerHttpError(500, "Test Error");
          });
        server.inject(request).then(res => {
          expect(getHeadersMethod).toHaveBeenCalled();
          expect(ccmGetMethod).toBeCalledTimes(2);
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithoutErrorMessage);
          done();
        });
      });
    });
  });

});
