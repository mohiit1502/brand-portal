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

  static  getAllValuesFromRecursiveTree(tree) {

    if (typeof tree !== "object" || tree === null) {
      return [tree];
    }

    const list = [];

    for (const i in tree) {
      if (tree.hasOwnProperty(i)) {
        list.push(...this.getAllValuesFromRecursiveTree(tree[i]));
      }
    }
    return list;
  }

}
