/* eslint-disable no-undef */
import CONSTANTS from "../constants/constants";

export default class Helper {
    static toCamelCaseFirstUpper (incoming) {
        if (!incoming) {
            return "";
        }

        if (incoming.includes("-")) {
            const strParts = incoming.split("-");
            return strParts.reduce((acc, curr) => Helper.toCamelCaseIndividual(acc) + Helper.toCamelCaseIndividual(curr));
        }
        return Helper.toCamelCaseIndividual(incoming);
    }

    static loader (path, enable) {
      this.setState(state => {
        try {
            const stateClone = {...state};
            const fieldObj = Helper.search(path, stateClone);
            fieldObj.loader = enable;
            return stateClone;
        } catch (e) {}
      });
    }

    static search (path, obj) {
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
          recurredObject = recurredObject[pathArr[i]];
          i++;
        }
        return recurredObject;
      } catch (e) {
        return "";
      }
    }

    static toCamelCase (incoming) {
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

    static toCamelCaseEach (incoming) {
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

    static toCamelCaseIndividual (part, isFirstLower) {
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

    static debounce (func, wait) {
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
}
