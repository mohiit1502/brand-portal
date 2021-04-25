/* eslint-disable no-undef */
import CONSTANTS from "../constants/constants";
import * as d3 from "d3";
import Http from "./Http";
import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";

export default class Helper {
  static toCamelCaseFirstUpper(incoming) {
    if (!incoming) {
      return "";
    }

    if (incoming.includes("-")) {
      const strParts = incoming.split("-");
      return strParts.reduce((acc, curr) => Helper.toCamelCaseIndividual(acc) + Helper.toCamelCaseIndividual(curr));
    }
    return Helper.toCamelCaseIndividual(incoming);
  }

  static loader(path, enable) {
    this.setState(state => {
      try {
        const stateClone = {...state};
        const fieldObj = Helper.search(path, stateClone);
        fieldObj.loader = enable;
        return stateClone;
      } catch (e) {}
    });
  }

  static search(path, obj, selector) {
    try {
      if (!path) return obj;
      const pathArr = path.split(".");
      if (!obj) {
        obj = CONSTANTS;
        if (pathArr[0] === "CONSTANTS") {
          pathArr.splice(0, 1);
        }
      }
      let recurredObject = obj;
      let i = 0;
      while (i < pathArr.length) {
        if (typeof recurredObject === "object" && recurredObject.length !== undefined) {
          recurredObject = recurredObject.find(itemInner => itemInner[pathArr[i]] === selector)
        } else {
          recurredObject = recurredObject[pathArr[i]];
        }
        i++;
      }
      return recurredObject;
    } catch (e) {
      return "";
    }
  }

  static toCamelCase(incoming) {
    if (!incoming) {
      return "";
    }

    if (incoming.includes("-")) {
      const strParts = incoming.split("-");
      let accumulated = "";
      const first = Helper.toCamelCaseIndividual(strParts[0], true);
      if (strParts.length > 1) {
        accumulated = strParts.slice(1).reduce((acc, curr) => Helper.toCamelCaseIndividual(acc) + Helper.toCamelCaseIndividual(curr));
      }
      return first + accumulated;
    }
    return Helper.toCamelCaseIndividual(incoming);
  }

  static toCamelCaseEach(incoming) {
    if (!incoming) {
      return "";
    }

    if (incoming.includes(" ")) {
      const strParts = incoming.split(" ");
      let accumulated = "";
      const first = Helper.toCamelCaseIndividual(strParts[0]);
      if (strParts.length > 1) {
        accumulated = strParts.slice(1).reduce((acc, curr) => Helper.toCamelCaseIndividual(acc) + " " + Helper.toCamelCaseIndividual(curr));
      }
      return first + " " + accumulated;
    }
    return Helper.toCamelCaseIndividual(incoming);
  }

  static toCamelCaseIndividual(part, isFirstLower) {
    if (!part) {
      return "";
    }
    if (part.length === 1) {
      return part.toUpperCase();
    }

    const strFirst = isFirstLower ? part.substring(0, 1).toLowerCase() : part.substring(0, 1).toUpperCase();
    const strRest = part.substring(1).toLowerCase();
    return strFirst + strRest;
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static wrap(text, width) {
    text.each(function () {
      const text = d3.select(this),
        words = text.text().match(/.{1,6}/g).reverse(),
        lineHeight = 0.75,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy"));
      let word, line = [], lineNumber = 0, tspan = text.text(null).append("tspan").attr("x", -8).attr("y", y).attr("dy", ((words.length > 1) ? (dy - 0.25 ) : dy) + "em");
      while (word = words.pop()) {
        if(lineNumber === 1)
          break;
        line.push(word);
        tspan.text(line.join(" "));
        // console.log("computed", tspan.node().getComputedTextLength())
        // console.log("width", width)
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", -8).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  static updateChart (filterData, chartsContainerMeta) {
    let url = chartsContainerMeta.API;
    chartsContainerMeta.setLoader(true);
    const baseUrl = url.substring(0, url.indexOf("__"));
    let params = url.substring(url.indexOf("__"));
    filterData && Object.keys(filterData).forEach(filter => {
      const filterMeta = chartsContainerMeta.filters.find(filterItem => filterItem.name === filter);
      let filterValue = filterMeta && filterMeta.backendMapper ? filterMeta.backendMapper[filterData[filter]] : filterData[filter];
      if (filter === "dateRange" && filterValue === "customDate") {
        filterValue = filterData.value;
      }
      params = params.replace(`__${filter}__`, filter + ":" + filterValue)
    })
    if (params.indexOf("__") > -1) {
      const firstUS = params.indexOf("__");
      const preParam = params.substring(0, firstUS);
      const restParam = params.substring(firstUS + 2);
      const secondUS = preParam.length + restParam.indexOf("__") + 4;
      const param = params.substring(firstUS, secondUS)
      const paramTrimmed = param.substring(2, param.lastIndexOf("__"));
      params = params.replace(param, paramTrimmed + ":" + param);
    }
    const mixpanelPayload = {
      API: baseUrl,
      WORK_FLOW: "MY_DASHBOARD",
      CHART_SELECTED: MIXPANEL_CONSTANTS.FILTER_SELECTED_MAPPING[chartsContainerMeta.DATAKEY],
      DATA_RANGE: filterData && filterData.dateRange
    };
    if (filterData.claimType)  mixpanelPayload.CLAIM_TYPE = filterData && filterData.claimType;
    url = baseUrl + btoa(params);
    try {
      Http.get(url)
        .then(response => {
          chartsContainerMeta.setDataLocal(response.body.data && response.body.data[chartsContainerMeta.DATAKEY] ? response.body.data[chartsContainerMeta.DATAKEY] : chartsContainerMeta.dataLocal);
          chartsContainerMeta.setLoader(false);
          mixpanelPayload.API_SUCCESS = true;
        })
        .catch(err => {
          console.log(err)
          chartsContainerMeta.setLoader(false);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.VIEW_DASHBOARD_WORKFLOW.FILTER_SELECTED, mixpanelPayload);
        });
    } catch (e) {
      chartsContainerMeta.setLoader(false);
    }
  }

  static getParamsEncoded (url, user) {
    let baseUrl, params, interpolatedUrl;
    if (url && url.indexOf("__") > -1) {
      baseUrl = url.substring(0, url.indexOf("__"));
      params = url.substring(url.indexOf("__"));
      const paramsInterpolated = params && user && user.role && params.replace("__orgId__", "orgId:" + user.organization.id).replace("__emailId__", "emailId:" + user.email).replace("__role__", "role:" + user.role.name);
      const paramsEncoded = btoa(paramsInterpolated);
      interpolatedUrl = baseUrl + paramsEncoded;
    } else {
      interpolatedUrl = url && user && user.role && url.replace("__orgId__", user.organization.id).replace("__emailId__", user.email).replace("__role__", user.role.name);
    }
    return interpolatedUrl;
  }

  static trimSpaces(incoming) {
    const value = typeof incoming === "object" ? incoming.target.value : incoming;
    return value.replace(/  +/g, ' ').replace(/^\s+/g, "");
  }
}
