import queryString from "query-string";
import {Redirect} from "react-router";
import React from "react";

export default class ClientUtils {

  static getQueryParams (location) {
    return queryString.parse(location.search);
  }

  static navigateTo (path) {
    return <Redirect to={path} />;
  }

}
