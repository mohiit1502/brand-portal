import Hapi from "hapi";
import ServerUtils from "../../../src/server/utility/server-utils";
import headerResponse from "../mocks/headers-response.json";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import classUnderTest from "../../../src/server/plugins/content/content-manager-api";
import ServerHttp from "../../../src/server/utility/ServerHttp";
import successResponse from "../mocks/success-response.json";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";
import failureResponseWithErrorMessage from "../mocks/failure-response-with-error-message.json";
import failureResponseWithoutErrorMessage from "../mocks/failure-response-without-error-message.json";
import contentResposne from "./../mocks/content-response.json";

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod;
let mixPanelSetTokenMethod;

const endPoints = [
  {
    method: "GET",
    url: "/api/helpConfig",
    functionName: "Get Help Configuration"
  },
  {
    method: "GET",
    url: "/api/loginConfig",
    functionName: "Get Landing Page Configuration"
  },
  {
    method: "GET",
    url: "/api/formConfig",
    functionName: "Get Form Field Configuration"
  },
  {
    method: "GET",
    url: "/api/mixpanelConfig",
    functionName: "Get Mixpanel Configuration"
  },
  {
    method: "GET",
    url: "/api/webformConfig",
    functionName: "Get Webform Configuration"
  },
  {
    method: "GET",
    url: "/api/getCaptchaConfig",
    functionName: "Get Captcha Configuration"
  }
];

const setUp = () => {
  server = new Hapi.Server();
  mixPanelTrackEventMethod = jest.spyOn(mixpanel,"trackEvent").mockImplementationOnce(() => {
    console.log("This is mock mixpanel implementation");
  });
  mixPanelSetTokenMethod = jest.spyOn(mixpanel,"setToken").mockImplementationOnce(() => {
    console.log("This is mock mixpanel implementation");
  });
  server.register(classUnderTest);
};

describe("Test Content Manager API",() => {
  describe("Content Api Successful",() => {
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
        ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
          .mockResolvedValueOnce("{\"testContent\":\"This is test content\"}");
        server.inject(request).then(res => {
          expect(ccmGetMethod).toBeCalledTimes(1);
          if(endPoint.functionName === "Get Form Field Configuration" ||
            endPoint.functionName === "Get Landing Page Configuration" ||
            endPoint.functionName === "Get Help Configuration")
            expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          if(endPoint.functionName.toLowerCase() === "get mixpanel configuration"){
            expect(mixPanelSetTokenMethod).toHaveBeenCalled();
          }
          expect(res.statusCode).toBe(200);
          if(endPoint.functionName.toLowerCase() === "get mixpanel configuration")
            expect((res.payload)).toBe("{}");
          else
            expect((res.payload)).toBe("{\"testContent\":\"This is test content\"}");
          done();
        })
      });
    });
  });

  describe("Content APIs failure with error message",() => {
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
        ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
          .mockImplementation(() => {
            throw new ServerHttpError(500, "Test Error", "This is a test error message");
          });
        server.inject(request).then(res => {
          expect(ccmGetMethod).toBeCalledTimes(1);
          if(endPoint.functionName === "Get Form Field Configuration" ||
            endPoint.functionName === "Get Landing Page Configuration" ||
            endPoint.functionName === "Get Help Configuration")
            expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
          done();
        });
      });
    });
  });

  describe("Content APIs failure without error message",() => {
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
        ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
          .mockImplementation(() => {
            throw new ServerHttpError(500, "Test Error");
          });
        server.inject(request).then(res => {
          expect(ccmGetMethod).toBeCalledTimes(1);
          if(endPoint.functionName === "Get Form Field Configuration" ||
            endPoint.functionName === "Get Landing Page Configuration" ||
            endPoint.functionName === "Get Help Configuration")
            expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithoutErrorMessage);
          done();
        });
      });
    });
  });
});
