import queryString from "query-string";

export default class ClientUtils {

  static getQueryParams (location) {
    return queryString.parse(location.search);
  }
}
