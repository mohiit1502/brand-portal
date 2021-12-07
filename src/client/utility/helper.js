/* eslint-disable no-undef, no-magic-numbers, no-unused-expressions, max-statements, no-empty, no-invalid-this, no-loop-func */
import CONSTANTS from "../constants/constants";
import * as d3 from "d3";
import Http from "./Http";
import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";
import moment from "moment";

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
      return state;
    });
  }

  /**
   * Following utility searches for a value in an object recursively
   *
   * It loops over object to dig deeper for flat objects and supports two ways to search in
   * arrays that may occur inside object, either provide file path by specifying keys with a selector for array
   * to find, this will only support searching one array in object.
   * Second way is to use path format obj.a.b[index].c.d[index].e and no selector. This way provides searching
   * any depth of arrays and objects
   *
   * @param path path of field to search in format obj.a.b.c or obj.a.b[index].c for arrays
   * @param obj Object where the value needs to be searched
   * @param selector provide a selector for the array to look for next object to search
   * @returns {{KEY_CODE_HOME: number, REGEX: {ZIP: string, NAMES: string, PASSWORD: string, PHONE: string, REDIRECTALLOWEDPATHS: string, EMAIL: string, CLAIMDETAILSPATH: string, COMPANY: string}, NAVIGATION_PANEL: [{image: string, name: string, active: boolean, id: string, href: string, value: string}, {image: string, name: string, active: boolean, id: string, href: string, value: string}, {image: string, name: string, active: boolean, id: string, href: string, value: string}, {image: string, name: string, active: boolean, id: string, href: string, value: string}], WEBFORM: {CTA: string, CLAIM_SUBMISSION: string, LANDING_PAGE: string}, APPROVAL: {SECTION_TITLE_PLURAL: string, STATUS: {}, SECTION_TITLE_SINGULAR: string}, URL: {LOGOUT: string, REGISTER_REDIRECT: string, DOMAIN: {DEVELOPMENT: string, STAGING: string, PRODUCTION: string}, IMAGE: string, LOGIN_REDIRECT: string, DOMAIN_SERVER: {DEVELOPMENT: string, STAGING: string, PRODUCTION: string}}, STATUS_CODE_NOT_FOUND: number, CLAIM: {SECTION_TITLE_PLURAL: string, STATUS: {}, SECTION_TITLE_SINGULAR: string}, CODES: {ERRORCODES: {FOURNOTFOUR: string, UNAUTHORIZED: number, SERVERERROR: string, SERVERDOWN: number, FORBIDDEN: string, SERVERDOWNWRAPPER: number}}, STATUS_CODE_400: number, APIDEBOUNCETIMEOUT: number, POPOVERSELECTOR: string, LOGIN: {REGISTER_TEXT: string, LANDING_PAGE_TEXT: string, PRIVACYURL: string, CONTACTEMAIL: string, COPYRIGHTTEXT: string, PRIVACYTEXT: string, CONTACTTEXT: string, IMAGE_WALMART_INTRO: string}, NOTIFICATIONPOPUP: {FAILUREIMAGE: string, SUCCESSIMAGE: string, CLOSEBUTTONFAILURE: string, CLOSEBUTTONSUCCESS: string, DATADELAY: number}, ERRORMESSAGES: {ZIPERROR: string, EMAILERROR: string, PHONEERROR: string}, ONGOING_CLAIM_TYPES: {COUNTERFEIT: string, TRADEMARK: string, PATENT: string, COPYRIGHT: string}, KEY_CODE_SHIFT: number, ROUTES: {PROTECTED: {HELP: {HELP: string, CONTACT: string, FAQ: string, USER: string, CLAIM: string, BRAND: string}, USER_MGMT: {USER_APPROVAL: string, USER_LIST: string}, PROFILE: {USER: string}, DEFAULT_REDIRECT_PATH_REPORTER: string, CLAIMS: {CLAIMS_LIST: string, CLAIM_DETAILS: string}, DASHBOARD: string, DEFAULT_REDIRECT_PATH_SUPERADMIN: string, ROOT_PATH: string, ONBOARD: {BRAND_REGISTER: string, APPLICATION_REVIEW: string, COMPANY_REGISTER: string}, DEFAULT_REDIRECT_PATH_ADMIN: string, BRANDS: {BRANDS_LIST: string}}, OPEN: {LOGIN_TYPE_CTA: string, SERVICES: string, REGISTER_TYPE_CTA: string}}, SORTSTATE: {ASCENDING: number, DATETYPE: string, DESCENDING: number, NUMERICTYPE: string, RESET: number, ARRAYTYPE: string}, KEY_CODE_DELETE: number, ALLOWED_KEY_CODES, USER: {SECTION_TITLE_PLURAL: string, STATUS: {NEW: string, PENDING_SUPPLIER: string, ACTIVE: string, TOU_NOT_ACCEPTED: string, SUSPENDED: string, PENDING_SELLER: string, PENDING: string, REJECTED: string}, ROLES: {REPORTER: string, SUPERADMIN: string, ADMIN: string}, USER_TYPE: {INTERNAL: string, THIRD_PARTY: string}, SECTION_TITLE_SINGULAR: string, UNIQUENESS_CHECK_STATUS: {DENY: string, ALLOW: string}, VALUES: {STATUS: {"Pending Supplier Activation": string, Suspended: string, "Pending Seller Activation": string}}, OPTIONS: {DISPLAY: {RESENDINVITE: string, DELETE: string, SUSPEND: string, EDIT: string, REACTIVATE: string}, PAYLOAD: {SUSPEND: string, ACTIVE: string}}}, BRAND: {SECTION_TITLE_PLURAL: string, STATUS: {SUSPENDED: string, PENDING: string, VERIFIED: string, REJECTED: string}, SECTION_TITLE_SINGULAR: string, OPTIONS: {DISPLAY: {DELETE: string, SUSPEND: string, EDIT: string, REACTIVATE: string}, PAYLOAD: {SUSPEND: string, ACTIVE: string, VERIFIED: string}}}, STATUS_CODE_SUCCESS: number, KEY_CODE_BACKSPACE: number, KEY_CODE_END: number, MIXPANEL: {PROJECT_TOKEN: string}, KEY_CODE_TAB: number, SECTION: {CLAIMS: string, APPROVALLIST: string, USERLIST: string, USERS: string, BRANDS: string}, ONCHANGEVALIDATIONTIMEOUT: number}|string|*}
   */
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
        let key, index;
        const SBIndex = pathArr[i].indexOf("[");
        const SBCloseIndex = pathArr[i].indexOf("]");
        key = SBIndex > -1 ? pathArr[i].substring(0, SBIndex) : pathArr[i];
        index = SBIndex > -1 && pathArr[i].substring(SBIndex + 1, SBCloseIndex);
        if (typeof recurredObject === "object" && (recurredObject.length !== undefined || typeof index === "string")) {
          recurredObject = index ? recurredObject[key][+index] : recurredObject.find(itemInner => itemInner[key] === selector);
        } else {
          recurredObject = recurredObject[key];
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
        accumulated = strParts.slice(1).reduce((acc, curr) => `${Helper.toCamelCaseIndividual(acc)  } ${  Helper.toCamelCaseIndividual(curr)}`);
      }
      return `${first  } ${  accumulated}`;
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

  static wrap(textIncoming, width) {
    textIncoming.each(function () {
      const text = d3.select(this);
      const words = text.text().match(/.{1,6}/g).reverse();
      const lineHeight = 0.75;
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));
      let word;
      let line = [];
      let lineNumber = 0;
      /* eslint-disable no-cond-assign */
      let tspan = text.text(null).append("tspan").attr("x", -8).attr("y", y).attr("dy", `${(words.length > 1) ? (dy - 0.25) : dy}em`);
      while (word = words.pop()) {
        if (lineNumber === 1) {break;}
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", -8).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy  }em`).text(word);
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
      params = (filter === "claimType" && filterValue === "__claimType__") ? params : params.replace(`__${filter}__`, `${filter  }:${  filterValue}`);
    });
    if (params.indexOf("__") > -1) {
      const firstUS = params.indexOf("__");
      const preParam = params.substring(0, firstUS);
      const restParam = params.substring(firstUS + 2);
      const secondUS = preParam.length + restParam.indexOf("__") + 4;
      const param = params.substring(firstUS, secondUS);
      const paramTrimmed = param.substring(2, param.lastIndexOf("__"));
      params = params.replace(param, `${paramTrimmed  }:${  param}`);
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
    let baseUrl;
    let params;
    let interpolatedUrl;
    if (url && url.indexOf("__") > -1) {
      baseUrl = url.substring(0, url.indexOf("__"));
      params = url.substring(url.indexOf("__"));
      const paramsInterpolated = params && user && user.role && params.replace("__orgId__", `orgId:${  user.organization.id}`).replace("__emailId__", `emailId:${  user.email}`).replace("__role__", `role:${  user.role.name}`);
      const paramsEncoded = btoa(paramsInterpolated);
      interpolatedUrl = baseUrl + paramsEncoded;
    } else {
      interpolatedUrl = url && user && user.role && url.replace("__orgId__", user.organization.id).replace("__emailId__", user.email).replace("__role__", user.role.name);
    }
    return interpolatedUrl;
  }

  static trimSpaces(incoming) {
    const value = typeof incoming === "object" ? incoming.target.value : incoming;
    return value.replace(/  +/g, " ").replace(/^\s+/g, "");
  }

  static getDateFromTimeStamp(timestamp) {
    try {
      const dateParts = timestamp.split("T");
      let dateString;
      if (dateParts && dateParts[0]) {dateString = dateParts[0];}
      return moment(dateString).format("MM-DD-YYYY");
    } catch (e) {}
    return "";
  }
}
