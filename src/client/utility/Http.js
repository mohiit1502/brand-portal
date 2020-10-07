/* eslint-disable complexity */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-params */
/* eslint-disable max-statements */
import fetch from "node-fetch";
import queryString from "query-string";
import ClientHttpError from "./ClientHttpError";
import { NOTIFICATION_TYPE } from "../actions/notification/notification-actions";
import CONSTANTS from "../constants/constants";
export default class Http {

  static async get(url, queryParams, callback, toastCallback) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {method: "GET"};
    return Http.crud(urlString, options, callback, toastCallback);
  }

  static async post(url, data, queryParams, callback, toastCallback) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    };
    return Http.crud(urlString, options, callback, toastCallback);
  }

  static async postAsFormData(url, data, queryParams, callback, toastCallback) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: data,
      headers: { }
    };
    return Http.crud(urlString, options, callback, toastCallback);
  }

  static async put(url, data, queryParams, callback, toastCallback) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    };
    return Http.crud(urlString, options);
  }

  static async delete(url, queryParams, callback, toastCallback) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "DELETE",
      noInject: true
    };
    return fetch(urlString, options);
  }

  static async crud (urlString, options, callback, toastCallback) {
    const response = await fetch(urlString, options);
    const {ok, status, headers} = response;
    if (ok) {
      if (headers.get("content-type").indexOf("application/json") !== -1) {
        const body = await response.json();
        callback && typeof callback === "function" && callback();
        return {status, body};
      }
      const body = await response.text();
      callback && typeof callback === "function" && callback();
      return {status, body};
    }
    toastCallback && typeof toastCallback === "function" && Http.displayToast(status, toastCallback);
    callback && typeof callback === "function" && callback();
    const err = await response.json();
    console.log(err);
    throw new ClientHttpError(status, err.error, err.message);
  }

  static displayToast(status, toastCallback) {
    if (new RegExp(CONSTANTS.CODES.ERRORCODES.SERVERERROR).test(status)) {
       toastCallback&& typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, `Unable to reach our services currently, please try again in sometime.`);
    } else if (new RegExp(CONSTANTS.CODES.ERRORCODES.FOURNOTFOUR).test(status)) {
       toastCallback&& typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, `Requested Resource could not be found.`);
    }
  }
}
