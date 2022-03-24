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

  static async post(url, options, data, workflow) {
    options.headers = options.headers ? {"Content-Type": "application/json", ...options.headers} : {"Content-Type": "application/json"};
    options.method = "POST";
    options.body = typeof data === "string" ? data : JSON.stringify(data);
    return await ServerHttp.crud(url, options, "post", workflow);
  }

  static async postAsFormData(url, options, data) {
    options.method = "POST";
    options.body = data;
    return await ServerHttp.crud(url, options, "postAsFormData");
  }

  static async put(url, options, data, workflow) {
    options.headers = options.headers ? {"Content-Type": "application/json", ...options.headers} : {"Content-Type": "application/json"};
    options.method = "PUT";
    options.body = JSON.stringify(data);
    return await ServerHttp.crud(url, options, "put", workflow);
  }

  static async delete(url, options, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    options.method = "DELETE";
    return await ServerHttp.crud(urlString, options, "delete");
  }

  /* eslint-disable max-statements */
  /* eslint-disable no-console */
  /* eslint-disable no-magic-numbers */
  static async crud (urlString, options, method, workflow) {
    let requestStartTime;
    let requestEndTime;
    const corrId = options.headers.ROPRO_CORRELATION_ID || options.headers["WM_QOS.CORRELATION_ID"];
    const mixpanelPayload = {
      URL: urlString,
      METHOD: method,
      CORRELATION_ID: corrId
    };
    workflow && (mixpanelPayload.WORKFLOW = workflow);
    try {
      /* eslint-disable no-unused-expressions */
      !urlString && console.log("No URL!!");
      console.log("[Corr ID: %s] 1. ===== Crud Request Start. Requesting URL: ", corrId, urlString);
      requestStartTime = Date.now();
      const response = await fetch(urlString, options);
      requestEndTime = Date.now();
      const {ok, status, headers} = response;
      const isJson = utils.isContentJson(headers);
      if (ok) {
        console.log("[Corr ID: %s] 2. Response is OK with status: ", corrId, status);
        return isJson ? {status, body: await response.json()} : {status, body: await response.text()};
      }
      console.log("[Corr ID: %s][%s] 3. Response not OK, logging response: ", corrId, urlString, response);
      let err;
      try {
        err = isJson ? await response.json() : await response.text();
      } catch (e) {
        isJson && (err = await response.text());
      }
      const errorString = `[Corr ID: %s] 5. In ServerHttp.${method} - Capturing error for not Ok response ====== `;
      console.log(errorString, corrId, err);
      throw new ServerHttpError(status, err.error, err.message, err.code, corrId, urlString,
        options && options.headers && options.headers.ROPRO_USER_ID);
    } catch (e) {
      requestEndTime  = requestEndTime ? requestEndTime : Date.now();
      const errorString = `[Corr ID: %s] 6. Caught in ServerHttp.${method}: `;
      console.error(errorString, corrId, e);
      throw new ServerHttpError(e.status || 500, e, e.message, e.code, corrId, urlString,
        options && options.headers && options.headers.ROPRO_USER_ID);
    } finally {
      mixpanelPayload.RESPONSE_TIME = requestEndTime - requestStartTime;
      console.log(`[Corr ID: %s] Total Response Time for ${urlString} is: ${requestEndTime - requestStartTime}`, corrId);
      console.log("[Corr ID: %s] 7. === Crud Request End!", corrId);
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.SERVER_HTTP.SERVER_RESPONSE_TIME, mixpanelPayload);
    }
  }
}
