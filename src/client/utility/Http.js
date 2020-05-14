import {fetchJSON} from "@walmart/electrode-fetch";
import queryString from "query-string";

export default class Http {

  static get(url, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "GET"
    };
    return fetchJSON(urlString, options);
  }

  static post(url, data, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "POST",
      body: JSON.stringify(data)
    };
    return fetchJSON(urlString, options);
  }

  static delete(url, queryParams) {
    const urlString = queryString.stringifyUrl({url, query: queryParams});
    const options = {
      method: "DELETE",
      noInject: true
    };
    return fetchJSON(urlString, options);
  }
}
