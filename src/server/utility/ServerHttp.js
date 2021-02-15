import fetch from "node-fetch";
import queryString from "query-string";
import ServerHttpError from "./ServerHttpError";
import CONSTANTS from "../../client/constants/constants";
import ClientHttpError from "../../client/utility/ClientHttpError";

export default class ServerHttp {

  static async get(url, options, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    options.method = "GET";
    return await ServerHttp.crud(urlString, options, "get");
  }

  static async post(url, options, data) {
    options.headers = options.headers ? {"Content-Type": "application/json", ...options.headers} : {"Content-Type": "application/json"};
    options.method = "POST";
    options.body = typeof data === "string" ? data : JSON.stringify(data);
    return await ServerHttp.crud(url, options, "post");
  }

  static async postAsFormData(url, options, data) {
    options.method = "POST";
    options.body = data;
    return await ServerHttp.crud(url, options, "postAsFormData");
  }

  static async put(url, options, data) {
    options.headers = options.headers ? {"Content-Type": "application/json", ...options.headers} : {"Content-Type": "application/json"};
    options.method = "PUT";
    options.body = JSON.stringify(data);
    return await ServerHttp.crud(url, options, "put");
  }

  static async delete(url, options, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    options.method = "DELETE";
    return await ServerHttp.crud(urlString, options, "delete");
  }

  static async crud (urlString, options, method) {
    try {
      !urlString && console.log("No URL!!");
      console.log("1. ===== Crud Request Start. Requesting URL: ", urlString)
      const response = await fetch(urlString, options);
      const {ok, status, headers} = response;
      if (ok) {
        console.log("2. Response is OK with status: ", status);
        if (headers.get("content-type") === "application/json") {
          return {status, body: await response.json()};
        }
        return {status, body: await response.text()};
      }
      console.log("3. Response not OK, logging response: ", response);
      let err;
      try {
        err = await response.json();
      } catch (e) {
        console.log("4. Couldn't parse response as JSON, trying as text...");
        err = await response.text();
      }
      const errorString = `5. In ServerHttp.${method} - Capturing error for not Ok response ====== `
      console.log(errorString, err);
      throw new ServerHttpError(status, err.error, err.message);
    } catch (e) {
      const errorString = `6. Caught in ServerHttp.${method}: `;
      console.error(errorString, e);
      throw new ServerHttpError(500, e);
    } finally {
      console.log("7. === Crud Request End!");
    }
  }
}
