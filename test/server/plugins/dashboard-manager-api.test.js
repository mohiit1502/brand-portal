import classUnderTest from "../../../src/server/plugins/dashboard/dashboard-manager-api";
import Hapi from "hapi";
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ServerUtils from "../../../src/server/utility/server-utils";
import headerResponse from "../mocks/headers-response.json";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import ServerHttp from "../../../src/server/utility/ServerHttp";
import dashboardResponses from "../mocks/dashboardResponses.json";
import failureResponse from "../mocks/failure-response-with-error-message.json";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";

configure({ adapter: new Adapter() });

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod

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

const endPoints =  [
  {
    functionName: "getDashboardData",
    method: "GET",
    url: "/api/dashboard/b3JnSWQ6ZjliY2NmMTItNDlkMi00Mzg3LWIwNDctOTY3MGFjNjZmN2MwL2VtYWlsSWQ6c3ViaGFkZWVwLmRleUB3YWxtYXJ0LmNvbS9yb2xlOlN1cGVyIEFkbWlu",
  },
  {
    functionName: "reportedClaimType",
    method: "GET",
    url: "/api/dashboard/reportedClaimsType/b3JnSWQ6ZjliY2NmMTItNDlkMi00Mzg3LWIwNDctOTY3MGFjNjZmN2MwL2VtYWlsSWQ6c3ViaGFkZWVwLmRleUB3YWxtYXJ0LmNvbS9yb2xlOlN1cGVyIEFkbWluL2RhdGVSYW5nZTpsYXN0NjBkYXlz"
  },
  {
    functionName: "topReportedBrand",
    method: "GET",
    url: "/api/dashboard/topReportedBrands/b3JnSWQ6ZjliY2NmMTItNDlkMi00Mzg3LWIwNDctOTY3MGFjNjZmN2MwL2VtYWlsSWQ6c3ViaGFkZWVwLmRleUB3YWxtYXJ0LmNvbS9yb2xlOlN1cGVyIEFkbWluL2RhdGVSYW5nZTpsYXN0NjBkYXlzL2NsYWltVHlwZTpUcmFkZW1hcms="
  },{
    functionName: "topReporters",
    method: "GET",
    url: "/api/dashboard/topReporters/b3JnSWQ6ZjliY2NmMTItNDlkMi00Mzg3LWIwNDctOTY3MGFjNjZmN2MwL2VtYWlsSWQ6c3ViaGFkZWVwLmRleUB3YWxtYXJ0LmNvbS9yb2xlOlN1cGVyIEFkbWluL2RhdGVSYW5nZTphbGx0aW1lL2NsYWltVHlwZTpUcmFkZW1hcms="
  }
];

describe("Dashboard Tests ",() => {

  describe("Get Dashboard API Successful",() => {
    beforeEach(()=>{
      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValueOnce("https://test.com")
        .mockResolvedValueOnce("/test");
      setUp();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    endPoints.forEach(endpoint => {
      it(endpoint.functionName +" Successful",(done) => {
        const request = {
          method: endpoint.method,
          url: endpoint.url
        };

        serverHttpMethod = jest.spyOn(ServerHttp,"post")
          .mockResolvedValue(dashboardResponses[endpoint.functionName]);
        server.inject(request).then(res => {
          expect(getHeadersMethod).toHaveBeenCalled();
          expect(ccmGetMethod).toBeCalledTimes(2);
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(200);
          expect(JSON.parse(res.payload)).toEqual(dashboardResponses[endpoint.functionName].body);
          done();
        }).catch(err => {
          expect(true).toBe(false);
          done();
        });

      });
    })
  });

  describe("Get Dashboard API Failure",() => {
    beforeEach(()=>{
      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValueOnce("https://test.com")
        .mockResolvedValueOnce("/test");
      setUp();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    endPoints.forEach(endpoint => {
      it(endpoint.functionName +" Successful",(done) => {
        const request = {
          method: endpoint.method,
          url: endpoint.url
        };

        serverHttpMethod = jest.spyOn(ServerHttp,"post")
          .mockImplementation(() => {
            throw new ServerHttpError(500, "Test Error", "This is a test error message");
          });
        server.inject(request).then(res => {
          expect(getHeadersMethod).toHaveBeenCalled();
          expect(ccmGetMethod).toBeCalledTimes(2);
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponse);
          done();
        }).catch(err => {
          expect(true).toBe(false);
          done();
        });

      });
    })
  });

});
