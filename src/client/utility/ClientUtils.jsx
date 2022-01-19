import React from "react";
import queryString from "query-string";
import {Redirect} from "react-router";

export default class ClientUtils {

  static getQueryParams (location) {
    return queryString.parse(location.search);
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

  static where (arrayList, filterObj) {
    let index = -1;
    for (let i = 0; i < arrayList.length; i++) {
      for (const j in filterObj) {
        if (filterObj.hasOwnProperty(j) && arrayList[i].hasOwnProperty(j) && filterObj[j] === arrayList[i][j]) {
          index = i;
        } else {
          index = -1;
        }
      }
      if (index !== -1) {
        return index;
      }
    }
    return index;
  }

}
