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
import getAccessTokenResponse from "../mocks/getAccessTokenResponse.json";

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod;

jest.mock("/secrets/secrets.json", ()=> ({
  CLIENT_ID: 'a0e15a47-ce50-4416-9514-0641afab1fc2',
  CLIENT_TYPE: '',
  ENCODING: 'base64',
  GRANT_TYPE: 'authorization_code',
  IAM_TOKEN_URL: 'https://idp.stg.sso.platform.prod.walmart.com/platform-sso-server/token',
  IdTokenEncryptionKey: '{"kty":"oct","use":"enc","kid":"9a7392d7-dfdc-4af9-b829-bcdd1b3e1aad","k":"5hKE_Lgai-24Y5c4bU-60aRGmZ-7cGJxlBuCtCvZGmM"}',
  IQS_URL: 'http://iqs-gci-prod.walmart.com/search/_sql',
  IS_INTERNAL: false,
  NONCE_STRING_LENGTH: 8,
  RESPONSE_TYPE: 'code',
  SCOPE: 'openId',
  'WM_CONSUMER.ID': 'd3f2b7d1-f86f-4ec0-98be-3c2a45e7e743',
  'WM_CONSUMER.NAME': 'enigma',
  'WM_QOS.CORRELATION_ID': 'SOMECORRELATIONID',
  'WM_SVC.ENV': 'stg',
  'WM_SVC.NAME': 'platform-sso-server',
  'WM_SVC.VERSION': '1.0.0'
}), { virtual: true });

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
  mixpanel.setToken("test",true);
  getHeadersMethod = jest.spyOn(ServerUtils,"getHeaders")
    .mockResolvedValueOnce(headerResponse);
  ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
    .mockResolvedValueOnce("https://test.com")
    .mockResolvedValueOnce("/test");
  server.register(classUnderTest);
};

const setUpTwo = () => {
  server = new Hapi.Server();
  getHeadersMethod = jest.spyOn(ServerUtils,"getHeaders")
    .mockResolvedValueOnce(headerResponse);
  server.register(classUnderTest);

}

describe("Test User Manager API",() => {
  describe("User Api Successful",() => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    endPoints.forEach((endPoint) => {
      it(endPoint.functionName + " Successful",(done) => {
        setUp();
        const request = {
          method: endPoint.method,
          url: endPoint.url,
          payload: endPoint.payload
        };
        serverHttpMethod = jest.spyOn(ServerHttp,endPoint.method.toLowerCase())
          .mockResolvedValue(successResponse);
        server.inject(request).then(res => {
          expect(getHeadersMethod).toHaveBeenCalled();
          expect(ccmGetMethod).toHaveBeenCalled();
          expect(serverHttpMethod).toHaveBeenCalled();
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
    afterEach(() => {
      jest.resetAllMocks();
    });
    endPoints.forEach(endPoint => {
      it(endPoint.functionName + " failure with error message",(done) => {
        setUp();
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
          expect(ccmGetMethod).toHaveBeenCalled();
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
          done();
        });
      });
    });
  });

  describe("User APIs failure without error message",() => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    endPoints.forEach(endPoint => {
      it(endPoint.functionName + " failure without error message",(done) => {
        setUp();
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
          expect(ccmGetMethod).toHaveBeenCalled();
          expect(serverHttpMethod).toHaveBeenCalled();
          expect(res.statusCode).toBe(500);
          expect(JSON.parse(res.payload)).toEqual(failureResponseWithoutErrorMessage);
          done();
        });
      });
    });
  });

  describe("Login Success Redirect Tests",()=>{

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Successsful",(done) => {
      setUp();
      const request = {
        url: "/login-redirect?code=04A21D26AE8C493B9DAD8803238303E7&state=7JSAIHQE&clientType=seller&type=auth&clientId=a0e15a47-ce50-4416-9514-0641afab1fc2",
        method: "GET"
      }
      jest.spyOn(ServerUtils,"decryptToken").mockResolvedValue({loginId:"test.com","iam-token":"test"});

      serverHttpMethod = jest.spyOn(ServerHttp,"post")
        .mockResolvedValue(getAccessTokenResponse);

      server.inject(request).then(res => {
        expect(res.statusCode).toBe(302)
        done();
      }).catch(err => {
        expect(true).toBe(false);
      })
    })

    it("False",(done) => {
      setUp()
      const request = {
        url: "/login-redirect?code=04A21D26AE8C493B9DAD8803238303E7&state=7JSAIHQE&clientType=seller&type=auth&clientId=a0e15a47-ce50-4416-9514-0641afab1fc2",
        method: "GET"
      }

      serverHttpMethod = jest.spyOn(ServerHttp,"post")
        .mockImplementation(() => {
          throw new ServerHttpError(500, "Test Error", "This is a test error message");
        });

      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(500);
        done();
      }).catch(err => {
        expect(false).toBe(true);
        done();
      })
    })

  })

  describe("Check Health",() => {

    beforeEach(()=>{

    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Succesful",(done) => {
      setUp();
      const request = {
        url:"/health",
        method:"GET"
      }

      serverHttpMethod = jest.spyOn(ServerHttp,"get")
        .mockResolvedValue(successResponse);

      server.inject(request).then(res => {
        expect(JSON.parse(res.payload)).toEqual(successResponse.body);
        done();
      })
    });
    it("failure",(done) => {
      setUp();
      const request = {
        url:"/health",
        method:"GET"
      }

      serverHttpMethod = jest.spyOn(ServerHttp,"get")
        .mockImplementation(() => {
          throw new ServerHttpError(500, "Test Error", "This is a test error message");
        });

      server.inject(request).then(res => {
        expect(JSON.parse(res.payload)).toEqual(failureResponseWithErrorMessage);
        done();
      })

    });
  })

  describe("Get Logout Provider",() => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.resetAllMocks()
    });

    it("Succesful", (done) => {
      setUp();
      const request = {
        url: "/api/logoutProvider",
        method: "GET"
      }

      serverHttpMethod = jest.spyOn(ServerHttp, "get")
        .mockResolvedValue(successResponse);

      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(200);
        done();
      })
    });
    it("failure", (done) => {
      setUpTwo()
      const request = {
        url: "/api/logoutProvider",
        method: "GET"
      }


      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockImplementation(() => {
          throw new ServerHttpError(500, "Test Error", "This is a test error message");
        });
      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(500);
        done();
      })

    });
  });

  describe("Redirect To Falcon",() => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.resetAllMocks()
    });
    it("Succesful To login",(done) => {
      setUpTwo()
      const request = {
        method: "GET",
        url: "/api/falcon/login",
      }

      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValue({"FALCON_LOGIN_URL":"test.com"});

      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(302);
        done();
      })

    });
    it("Succesful To Register",(done) => {
      setUpTwo()
      const request = {
        method: "GET",
        url: "/api/falcon/register",
      }

      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockResolvedValue({"FALCON_REGISTER_URL":"test.com"});

      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(302);
        done();
      })

    });
    it("Redirect to falcon failed",(done) => {
      setUpTwo()
      const request = {
        method: "GET",
        url: "/api/falcon/register",
      }

      ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
        .mockImplementation(() => {
          throw new ServerHttpError(500, "Test Error", "This is a test error message");
        });

      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(500);
        done();
      })
    });
  })

  describe("Logout",() => {
    it("Succesful",(done) => {
      setUp();
      const request = {
        url:"/logout",
        method:"GET"
      }
      server.inject(request).then(res => {
        expect(res.statusCode).toEqual(302);
        done();
      })
      jest.resetAllMocks()
    });
  })
});


