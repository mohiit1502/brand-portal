import Hapi from "hapi";
import ServerUtils from "../../../src/server/utility/server-utils";
import headerResponse from "../mocks/headers-response.json";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import classUnderTest from "../../../src/server/plugins/claim/claim-manager-api";
import ServerHttp from "../../../src/server/utility/ServerHttp";
import successResponse from "../mocks/success-response.json";
import sellerResponse from "../mocks/seller-response.json";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";
import failureResponseWithErrorMessage from "../mocks/failure-response-with-error-message.json";
import failureResponseWithoutErrorMessage from "../mocks/failure-response-without-error-message.json";

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
    functionName: "Get Claims",
    method: "GET",
    url: "/api/claims"
  },
  {
    functionName: "Get Claim",
    method: "GET",
    url: "/api/claims/{ticketId}"
  },
  {
    method: "POST",
    url: "/api/claims",
    functionName: "Create Claim",
    payload: {
      test: "This is test payload"
    }
  },
  {
    method: "GET",
    url: "/api/claims/types",
    functionName: "Get Claim Types"
  },
  {
    method: "POST",
    url: "/api/claims/webform",
    functionName: "Create web-form Claim",
    payload: {
      test: "This is test payload"
    }
  }
];

describe("Test Claim Manager API",() => {

  describe("Claim Api Successful",() => {
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

  describe("Claim APIs failure with error message",() => {
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

  describe("Claim APIs failure without error message",() => {
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

describe("Get Seller API Tests",() => {

  beforeEach(()=>{
    setUp();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  server = new Hapi.Server();

  const request = {
    method: "GET",
    url: "/api/sellers"
  };

  ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
    .mockResolvedValue("select test,test from test where offer.US_WMT_DOTCOM_ITEM_ID='__itemId__' LIMIT 100")
    .mockResolvedValue("[50, 80, 100]");


  it("Get Sellers Failed request",() => {
    let serverRetryRequest = jest.spyOn(ServerUtils,"retry")
      .mockImplementation(() => {
      throw new ServerHttpError(500, "Test Error");
    });
    server.inject(request).then(res => {
      expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
      done();
    });
  });

  it("Get Sellers Success request",() => {
    let serverRetryRequest = jest.spyOn(ServerUtils,"retry")
      .mockImplementation(() => {
        return sellerResponse;
    });
    server.inject(request).then(res => {
      expect(JSON.parse(res.payload)).toEqual(successResponse);
      done();
    });
  });

});
