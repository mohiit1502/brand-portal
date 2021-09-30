/* eslint-disable complexity, no-unused-expressions, max-params, max-statements, no-magic-numbers, no-undef, no-unused-vars */
import fetch from "node-fetch";
import queryString from "query-string";
import ClientHttpError from "./ClientHttpError";
import { NOTIFICATION_TYPE } from "../actions/notification/notification-actions";
import CONSTANTS from "../constants/constants";

export default class Http {

  static async get(url, queryParams, callback, toastCallback, toastMessageSuccess, toastMessageFailure, unauthorizedCallback) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {method: "GET"};
    return Http.crud(urlString, options, callback, toastCallback, toastMessageSuccess, toastMessageFailure, unauthorizedCallback);
  }

  static async post(url, data, queryParams, callback, toastCallback, toastMessageSuccess, toastMessageFailure) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    };
    return Http.crud(urlString, options, callback, toastCallback, toastMessageSuccess, toastMessageFailure);
  }

  static async postAsFormData(url, data, queryParams, callback, toastCallback, toastMessageSuccess, toastMessageFailure) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: data,
      headers: { }
    };
    return Http.crud(urlString, options, callback, toastCallback, toastMessageSuccess, toastMessageFailure);
  }

  static async put(url, data, queryParams, callback, toastCallback, toastMessageSuccess, toastMessageFailure) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    };
    return Http.crud(urlString, options, callback, toastCallback, toastMessageSuccess, toastMessageFailure);
  }

  static async delete(url, queryParams, callback, toastCallback, toastMessageSuccess, toastMessageFailure) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "DELETE",
      noInject: true
    };
    return Http.crud(urlString, options, callback, toastCallback, toastMessageSuccess, toastMessageFailure);
  }

  static async crud (urlString, options, callback, toastCallback, toastMessageSuccess, toastMessageFailure, unauthorizedCallback) {
    const response = await fetch(urlString, options);
    const {ok, status, headers} = response;
    if (ok) {
      if (headers.get("content-type").indexOf("application/json") !== -1) {
        const body = await response.json();
        callback && typeof callback === "function" && callback();
        Http.displayToast(CONSTANTS.STATUS_CODE_SUCCESS, toastCallback, toastMessageSuccess, unauthorizedCallback, urlString);
        return {status, body};
      }
      const body = await response.text();
      callback && typeof callback === "function" && callback();
      return {status, body};
    }
    Http.displayToast(status, toastCallback, null, toastMessageFailure, unauthorizedCallback, urlString);
    callback && typeof callback === "function" && callback();
    const err = await response.json();
    throw new ClientHttpError(status, err.error, err.message);
  }

  static displayToast(status, toastCallback, toastMessageSuccess, toastMessageFailure, unauthorizedCallback, urlString) {
    if (CONSTANTS.CODES.ERRORCODES.SERVERDOWNWRAPPER === status) {
      toastCallback && typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, toastMessageFailure || "An unexpected error occurred!");
    } else if (CONSTANTS.CODES.ERRORCODES.SERVERDOWN === status) {
      toastMessageFailure && toastCallback && typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, toastMessageFailure);
    } else if (new RegExp(CONSTANTS.CODES.ERRORCODES.FOURNOTFOUR).test(status)) {
      toastMessageFailure && toastCallback && typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, toastMessageFailure);
      if (urlString && urlString.includes("/userInfo") && unauthorizedCallback && typeof unauthorizedCallback === "function") {
        unauthorizedCallback("not_found");
      }
    } else if (new RegExp(CONSTANTS.CODES.ERRORCODES.FORBIDDEN).test(status) || CONSTANTS.CODES.ERRORCODES.UNAUTHORIZED === status) {
      toastCallback && typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, toastMessageFailure ? toastMessageFailure : "Session Expired, redirecting to login...");
      if (unauthorizedCallback && typeof unauthorizedCallback === "function") {
        unauthorizedCallback("unauthorized");
      } else {
        /* eslint-disable no-return-assign */
        setTimeout(() => window.location.pathname = CONSTANTS.URL.LOGIN_REDIRECT, 1000);
      }
    } else if (new RegExp(CONSTANTS.CODES.ERRORCODES.SERVERERROR).test(status.toString())) {
      toastMessageFailure && toastCallback && typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.ERROR, toastMessageFailure ? toastMessageFailure : "Request failed, please try again.");
    } else if (status === CONSTANTS.STATUS_CODE_SUCCESS) {
      toastMessageSuccess && toastCallback && typeof toastCallback === "function" && toastCallback(NOTIFICATION_TYPE.SUCCESS, toastMessageSuccess);
    }
  }
}
