import Hapi from "hapi";
import ServerUtils from "../../../src/server/utility/server-utils";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import classUnderTest from "../../../src/server/plugins/content/content-manager-api";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";
import failureResponseWithErrorMessage from "../mocks/failure-response-with-error-message.json";
import failureResponseWithoutErrorMessage from "../mocks/failure-response-without-error-message.json";

let server;
let ccmGetMethod;
let mixPanelTrackEventMethod;
let mixPanelSetTokenMethod;

jest.mock("/secrets/secrets.json", ()=>({
  secrets: 'Test Secrets'
}), { virtual: true });

const endPoints = [
  {
    method: "GET",
    url: "/api/helpConfig",
    functionName: "Get Help Configuration"
  },
  {
    method: "GET",
    url: "/api/modalConfig",
    functionName: "Get Modal Configuration"
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
  mixpanel.setToken("test",true);
  server.register(classUnderTest);
};

describe("Test Content Manager API",() => {
  describe("Content Api Successful",() => {
    beforeEach(()=>{
      setUp();
    });
    afterEach(() => {
      jest.resetAllMocks();
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
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithoutErrorMessage);
          done();
        });
      });
    });
  });

  describe("Get Mixpanel Config",() => {

    server = new Hapi.Server();
    server.register(classUnderTest);


    const request = {
        method: "GET",
        url: "/api/mixpanelConfig"
    }
    beforeEach(() => {
      jest.resetAllMocks();
    });
    afterEach(() => {
      jest.resetAllMocks();
    })
    it("Successful",(done) => {
      jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValueOnce("{\"projectToken\":\"test-token\",\"enableTracking\":true}");
      jest.spyOn(mixpanel,"initializeMixpanel").mockImplementation(() => console.log("This is test initialize function"));
      server.inject(request).then(res => {
        expect(res.statusCode).toBe(200);
        expect((res.payload)).toBe("{\"projectToken\":\"test-token\",\"enableTracking\":true}");
        done();
      })


    })
    it("Failure",(done) => {
      jest.spyOn(ServerUtils,"ccmGet")
        .mockImplementation(() => {
          throw new ServerHttpError(500, "Test Error", "This is a test error message");
        });
      jest.spyOn(mixpanel,"initializeMixpanel").mockImplementation(() => console.log("This is test initialize function"));
      server.inject(request).then(res => {
        expect(res.statusCode).toBe(500);
        done();
      })


    })
  })
});
