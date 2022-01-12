import Hapi from "hapi";
import ServerUtils from "../../../src/server/utility/server-utils";
import headerResponse from "../mocks/headers-response.json";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import classUnderTest from "../../../src/server/plugins/company/company-manager-api";
import ServerHttp from "../../../src/server/utility/ServerHttp";
import successResponse from "../mocks/success-response.json";
import sellerResponse from "../mocks/seller-response.json";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";
import failureResponseWithErrorMessage from "../mocks/failure-response-with-error-message.json";
import failureResponseWithoutErrorMessage from "../mocks/failure-response-without-error-message.json";
const fs = require('fs');
import FormData from "form-data";
const streamToPromise = require('stream-to-promise');

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod
let randomStringGeneratorMethod;

jest.mock("/secrets/secrets.json", ()=>({
  secrets: 'Test Secrets'
}), { virtual: true });

const setUp = () => {

  server = new Hapi.Server();

  getHeadersMethod = jest.spyOn(ServerUtils,"getHeaders")
    .mockResolvedValueOnce(headerResponse);
  mixPanelTrackEventMethod = jest.spyOn(mixpanel,"trackEvent").mockImplementationOnce(() => {
    console.log("This is mock mixpanel implementation");
  });
  randomStringGeneratorMethod = jest.spyOn(ServerUtils,"randomStringGenerator")
    .mockResolvedValue("test");
  server.register(classUnderTest);
};

const endPoints =  [
  {
    functionName: "Company name availability",
    method: "GET",
    url: "/api/company/availability"
  },
  {
    functionName: "Check Trade mark Availability",
    method: "GET",
    url: "/api/brand/trademark/validity/{trademarkNumber}"
  },
  {
    method: "POST",
    url: "/api/org/register",
    functionName: "Register Company",
    payload: {
      test: "This is test payload"
    }
  },
  {
    method: "GET",
    url: "/api/org/applicationDetails/{orgId}",
    functionName: "Get Application Details"
  }
];

describe("Test Company Manager API",() => {

  describe("Company APIs Successful",() => {
    beforeEach(()=>{
      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValueOnce("https://test.com")
        .mockResolvedValueOnce("/test");
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
        }).catch(err => {
          expect(true).toBe(false);
          done();
        });
      });
    });
  });

  describe("Company APIs failure with error message",() => {
    beforeEach(()=>{
      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValueOnce("https://test.com")
        .mockResolvedValueOnce("/test");
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

  describe("Company APIs failure without error message",() => {
    beforeEach(()=>{
      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValueOnce("https://test.com")
        .mockResolvedValueOnce("/test");
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

describe("Doc upload Tests ",() => {

  const apis = ["/api/company/uploadBusinessDocument","/api/company/uploadAdditionalDocument"]
  beforeEach(()=>{
    ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
      .mockResolvedValueOnce("https://test.com")
      .mockResolvedValueOnce("/test");
    setUp();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  apis.forEach(api => {
    it(api + "Successful", (done) => {
      let postAsFormDataMock = jest.spyOn(ServerHttp,"postAsFormData").mockImplementation(() => {
        return successResponse;
      })
      let form = new FormData();
      form.append('file',fs.createReadStream(process.cwd() + '/test/server/mocks/mockFileUpload.txt'),{filename: 'mockFileUpload'})
      const request = {
        method: "POST",
        url: api,
        headers: form.getHeaders()
      }
      streamToPromise(form).then((payload) => {
        request.payload = payload;
        server.inject(request).then(res => {
          expect(JSON.parse(res.payload)).toEqual(successResponse.body);
          done();
        }).catch(err => {
          console.log(err);
        })
      })
    })

    it(api + "failure", (done) => {
      let postAsFormDataMock = jest.spyOn(ServerHttp,"postAsFormData").mockImplementation(() => {
        throw new ServerHttpError(500, "Test Error", "This is a test error message");
      })
      let form = new FormData();
      form.append('file',fs.createReadStream(process.cwd() + '/test/server/mocks/mockFileUpload.txt'),{filename: 'mockFileUpload'})
      const request = {
        method: "POST",
        url: api,
        headers: form.getHeaders()
      }
      streamToPromise(form).then((payload) => {
        request.payload = payload;
        server.inject(request).then(res => {
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
          done();
        }).catch(err => {
          console.log(err);
        })
      })
    })
  })
})
