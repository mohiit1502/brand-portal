import fetch from "node-fetch";
import queryString from "query-string";
import ClientHttpError from "./ClientHttpError";
export default class Http {

  static async get(url, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});

    const options = {
      method: "GET"
    };
    const response = await fetch(urlString, options);
    const {ok, status, headers} = response;

    if (ok) {
      if (headers.get("content-type").indexOf("application/json") !== -1) {
        const body = await response.json();
        return {status, body};
      }
      const body = await response.text();
      return {status, body};
    }

    const err = await response.json();
    console.log(err);
    throw new ClientHttpError(status, err.error, err.message);
  }

  static async post(url, data, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(urlString, options);
    const {ok, status, headers} = response;
    if (ok) {
      if (headers.get("content-type").indexOf("application/json") !== -1) {
        const body = await response.json();
        return {status, body};
      }
      const body = await response.text();
      return {status, body};
    }

    const err = await response.json();
    console.log(err);
    throw new ClientHttpError(status, err.error, err.message);

  }

  static async postAsFormData(url, data, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: data,
      headers: { }
    };
    const response = await fetch(urlString, options);
    const {ok, status, headers} = response;
    if (ok) {
      if (headers.get("content-type").indexOf("application/json") !== -1) {
        const body = await response.json();
        return {status, body};
      }
      const body = await response.text();
      return {status, body};
    }

    const err = await response.json();
    // console.log(err);
    throw new ClientHttpError(status, err.error, err.message);

  }

  static async put(url, data, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(urlString, options);
    const {ok, status, headers} = response;
    if (ok) {
      if (headers.get("content-type").indexOf("application/json") !== -1) {
        const body = await response.json();
        return {status, body};
      }
      const body = await response.text();
      return {status, body};
    }

    const err = await response.json();
    // console.log(err);
    throw new ClientHttpError(status, err.error, err.message);
  }

  static async delete(url, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "DELETE",
      noInject: true
    };
    return fetch(urlString, options);
  }
}
