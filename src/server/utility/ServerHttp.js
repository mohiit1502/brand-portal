import fetch from "node-fetch";
import queryString from "query-string";
import ServerHttpError from "./ServerHttpError";

export default class ServerHttp {

  static async get(url, options, queryParams) {

    const urlString = queryString.stringifyUrl({url, query: queryParams});

    const res = await fetch(urlString, {
      method: "GET",
      ...options
    });

    const {ok, status, headers} = res;

    if (ok) {
      if (headers.get("content-type") === "application/json") {
        return {status, body: await res.json()};
      }
      return res;
    }

    const err = await res.json();
    console.log(err);
    throw new ServerHttpError(status, err.error, err.message);

  }

  static async post(url, options, data) {

    options.headers = options.headers || {};
    options.headers = { "Content-Type": "application/json", ...options.headers };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options
    });

    const {ok, status, headers} = response;

    if (ok) {
      if (headers.get("content-type") === "application/json") {
        return {status, body: await response.json()};
      }
      return response;
    }

    const err = await response.json();
    console.log(err);
    throw new ServerHttpError(status, err.error, err.message);
  }

  static async put(url, options, data) {

    options.headers = options.headers || {};
    options.headers = { "Content-Type": "application/json", ...options.headers };
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options
    });

    const {ok, status, headers} = response;

    if (ok) {
      if (headers.get("content-type") === "application/json") {
        const body = await response.json();
        return {status, body};
      }
      return response;
    }

    const err = await response.json();
    console.log(err);
    throw new ServerHttpError(status, err.error, err.message);
  }

  static async delete(url, options, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});

    const res = await fetch(urlString, {
      method: "DELETE",
      ...options
    });

    const {ok, status} = res;

    if (ok) {
      return res;
    }

    const err = await res.json();
    console.log(err);
    throw new ServerHttpError(status, err.error, err.message);
  }
}
