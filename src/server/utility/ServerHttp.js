import fetch from "node-fetch";
import queryString from "query-string";
import ServerHttpError from "./ServerHttpError";
import mixpanel from "../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../constants/mixpanel-constants";
import utils from "../utility/server-utils";

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

  /* eslint-disable max-statements */
  /* eslint-disable no-console */
  /* eslint-disable no-magic-numbers */
  static async crud (urlString, options, method) {
    let requestStartTime;
    let requestEndTime;
    const mixpanelPayload = {
      URL: urlString
    };
    try {
      /* eslint-disable no-unused-expressions */
      !urlString && console.log("No URL!!");
      console.log("[%s] 1. ===== Crud Request Start. Requesting URL: ", options.headers.ROPRO_CORRELATION_ID, urlString);
      requestStartTime = Date.now();
      const response = await fetch(urlString, options);
      requestEndTime = Date.now();
      const {ok, status, headers} = response;
      const isJson = utils.isContentJson(headers);
      if (ok) {
        console.log("2. Response is OK with status: ", status);
        return isJson ? {status, body: await response.json()} : {status, body: await response.text()};
      }
      console.log("3. Response not OK, logging response: ", response);
      const err = isJson ? await response.json() : await response.text();
      const errorString = `5. In ServerHttp.${method} - Capturing error for not Ok response ====== `;
      console.log(errorString, err);
      throw new ServerHttpError(status, err.error, err.message, err.code, options && options.headers && options.headers.ROPRO_CORRELATION_ID, urlString,
        options && options.headers && options.headers.ROPRO_USER_ID);
    } catch (e) {
      requestEndTime  = requestEndTime ? requestEndTime : Date.now();
      const errorString = `6. Caught in ServerHttp.${method}: `;
      console.error(errorString, e);
      throw new ServerHttpError(e.status || 500, e, "", e.code, options && options.headers && options.headers.ROPRO_CORRELATION_ID, urlString,
        options && options.headers && options.headers.ROPRO_USER_ID);
    } finally {
      mixpanelPayload.RESPONSE_TIME = requestEndTime - requestStartTime;
      console.log(`Total Response Time for ${urlString} is: ${requestEndTime - requestStartTime}`);
      console.log("7. === Crud Request End!");
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.SERVER_HTTP.SERVER_RESPONSE_TIME, mixpanelPayload);
    }
  }
}
