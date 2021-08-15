import Hapi from "hapi";
import ServerUtils from "../../../src/server/utility/server-utils";
import headerResponse from "../mocks/headers-response.json";
import mixpanel from "../../../src/server/utility/mixpanelutility";
import classUnderTest from "../../../src/server/plugins/user/user-manager-api";
import ServerHttp from "../../../src/server/utility/ServerHttp";
import successResponse from "../mocks/success-response.json";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";
import failureResponseWithErrorMessage from "../mocks/failure-response-with-error-message.json";
import failureResponseWithoutErrorMessage from "../mocks/failure-response-without-error-message.json";

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod;

// {
//   method: "GET",
//     // url: "/ping",
//     url: "/health",
//   handler: this.checkHealth
// },
// {
//   method: "GET",
//     url: "/api/falcon/{action}",
//   handler: this.redirectToFalcon
// },
// {
//   method: "GET",
//     url: "/login-redirect",
//   handler: this.loginSuccessRedirect
// },
// {
//   method: "GET",
//     url: "/logout",
//   handler: this.logout
// },
// {
//   method: "GET",
//     url: "/api/logoutProvider",
//   handler: this.getLogoutProvider
// }

const endPoints = [
  {
    functionName: "Get user Info",
    method: "GET",
    url: "/api/userInfo",
  },
  {
    functionName: "Get New User Roles",
    method: "GET",
    url: "/api/newUser/roles"
  },
  {
    functionName: "Get New USer Brands",
    method: "GET",
    url: "/api/newUser/brands"
  },
  {
    functionName: "Get Users",
    method: "GET",
    url: "/api/users"
  },
  {
    functionName: "Check Unique",
    method: "GET",
    url: "/api/users/checkUnique"
  },
  {
    functionName: "Get Email Config",
    method: "GET",
    url: "/api/users/getEmailConfig"
  },
  {
    functionName: "Create User",
    method: "POST",
    url: "/api/users",
    payload: {
      test:"This is test payload"
    }
  },
  {
    functionName: "Update User",
    method: "PUT",
    url: "/api/users/{emailId}",
    payload: {
        parse: true
    }
  },
  {
    method: "PUT",
    url: "/api/users/{emailId}/status/{status}",
    functionName: "Update User Status"
  },
  {
    method: "PUT",
    url: "/api/users/updateTouStatus/{status}",
    functionName: "Update Tou Status",
    payload: {
      test:"This is test payload"
    }
  },
  {
    functionName: "Reinvite User",
    method: "POST",
    url: "/api/users/reinvite",
    payload: {
      test:"This is test payload"
    }
  },
  {
    functionName: "Reset Password",
    method: "POST",
    url: "/api/users/resetPassword",
    payload: {
      test:"This is test payload"
    }
  },
  {
    functionName: "Contact US",
    method: "POST",
    url:"/api/users/contactUs",
    payload: {
      test:"This is test payload"
    }
  },
  {
    functionName: "Delete User",
    method: "delete",
    url: "/api/users/{emailId}",
    options: {
      log: {
        collect: true
      }
    }
  }
];

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

describe("Test User Manager API",() => {
  describe("User Api Successful",() => {
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
          if(endPoint.method.toLowerCase() !== "delete")
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

  describe("User APIs failure with error message",() => {
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
          if(endPoint.method.toLowerCase() !== "delete")
            expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
          done();
        });
      });
    });
  });

  describe("User APIs failure without error message",() => {
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
          if(endPoint.method.toLowerCase() !== "delete")
            expect(mixPanelTrackEventMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithoutErrorMessage);
          done();
        });
      });
    });
  });
});
