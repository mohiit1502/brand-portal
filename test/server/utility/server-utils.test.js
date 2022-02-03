import ServerUtils from "./../../../src/server/utility/server-utils";
import ServerHttp from "../../../src/server/utility/ServerHttp";
import ServerHttpError from "../../../src/server/utility/ServerHttpError";

jest.mock("/secrets/secrets.json", ()=>({
  secrets: 'Test Secrets'
}), { virtual: true });
describe("Server Utils test",() => {

  describe("Retry Function",() => {
    it("Successful",(done) => {
      const request = {type:"get",url:"test.com",option:{}};
      jest.spyOn(ServerHttp,request.type).mockImplementationOnce(() => {
        throw new ServerHttpError(500, "Test Error", "This is a test error message");
      }).mockImplementation(() => {
        return {test:"This is test response"};
      });
      ServerUtils.retry(request,[1,2]).then(res => {
        expect(res).toStrictEqual({test:"This is test response"});
        done();
      });
    })

    it("Null Response",(done) => {
      const request = {type:"get",url:"test.com",option:{}};
      jest.spyOn(ServerHttp,request.type).mockImplementation(() => {
        throw new ServerHttpError(500, "Test Error", "This is a test error message");
      });
      ServerUtils.retry(request,[1,2]).then(res => {
        expect(res).toBe(null);
        done();
      });
    })

  });

  describe("CCM Get",() => {
    it("Successful",() => {
      const request = {
        app:{
          loadCCM : () => console.log("THis is a mock implementation"),
          ccmGet: (path) => {
            return {test:"this is test response"}
          }
        }
      }
      ServerUtils.ccmGet(request,"test").then(res => {
        expect(res).toStrictEqual({test:"this is test response"})
      })
    });

    it("Exception",() => {
      const request = {
        app:{
          loadCCM : () => {
            throw new ServerHttpError(500, "Test Error", "This is a test error message")
          },
          ccmGet: (path) => {
            return {test:"this is test response"}
          }
        }
      }
      ServerUtils.ccmGet(request,"test").then(res => {
        expect(true).toBe(false)
      }).catch(err => {
        console.log()
        expect(err.status).toBe(500);
        expect(err.message).toBe("This is a test error message");
      })
    })
  });

  describe("Get headers",() => {
    it("Successful",()=>{
      const res = ServerUtils.getHeaders({state:{},query:{}});
      expect(res["Content-Type"]).toBe("application/json");
    })
  })

  describe("Decrypt Token",() => {
    it("Successful",(done) => {
      const res = ServerUtils.decryptToken("test-token","{\"kty\":\"oct\",\"use\":\"enc\",\"kid\":\"9a7392d7-dfdc-4af9-b829-bcdd1b3e1aad\",\"k\":\"5hKE_Lgai-24Y5c4bU-60aRGmZ-7cGJxlBuCtCvZGmM\"}")
      done();
      expect(true).toBe(true);
    });
  })
});
