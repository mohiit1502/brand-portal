import ServerHttp from "../../../src/server/utility/ServerHttp";
import fetch from "node-fetch";
jest.mock('node-fetch', ()=>jest.fn())
// jest.mock('node-fetch', ()=>jest.fn())

describe("Server Http Tests",() => {

  const mapper = [
    {
      name : "GET",
      funcName : (urlString,options,queryParams) => ServerHttp.get(urlString,options,queryParams)
    },
    {
      name : "POST",
      funcName : (urlString, options, queryParams) => ServerHttp.post(urlString, options, queryParams)
    },
    {
      name : "postAsFormData",
      funcName : (urlString, options, queryParams) => ServerHttp.postAsFormData(urlString, options, queryParams)
    },
    {
      name : "put",
      funcName : (urlString, options, queryParams) => ServerHttp.put(urlString, options, queryParams)
    },
    {
      name : "delete",
      funcName : (urlString, options, queryParams) => ServerHttp.delete(urlString, options, queryParams)
    }
  ]

  describe("Get Successful",() => {

    mapper.forEach(method => {
      it(method.name + " Successful with content Type", (done) => {
        const response = Promise.resolve({
          ok: true,
          status: 200,
          headers: {
            get: (str) => {
              return "application/json";
            }
          },
          json: () => Promise.resolve({test: "This is test response"}),
        })
        fetch.mockImplementation(() => response)

        method.funcName("test.com", {headers: {}}, {}).then((res) => {
          expect(res.status).toBe(200);
          done();
        }).catch((err) => {
          expect(true).toBe(false);
        });

      });

      it(method.name + " Successful without content Type", (done) => {
        const response = Promise.resolve({
          ok: false,
          status: 500,
          headers: {
            get: (str) => {
              return "application/json";
            }
          },
          json: () => Promise.resolve({test: "This is test response"}),
        })
        fetch.mockImplementation(() => response)

        method.funcName("test.com", {headers: {}}, {}).then((res) => {
          expect(true).toBe(false);
        }).catch((err) => {
          expect(err.status).toBe(500);
          done();
        });
      });
    });
  });
});
