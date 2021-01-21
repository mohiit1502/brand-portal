import authConfig from "./../config/authorizations";
import Helper from "./helper";

export default class AuthUtil {
  static isActionAccessible (action, userProfile, actedOnRole) {
    if (action && action.indexOf(".") > -1) {
      const actionConfig = Helper.search(action, authConfig);
      if (actionConfig && userProfile && userProfile.role && userProfile.role.name && typeof actionConfig === "object") {
        const role = userProfile.role.name;
        if (actionConfig.length !== undefined) {
          return actionConfig.includes(role);
        } else {
          if (Object.keys(actionConfig).includes(role) && actedOnRole && actionConfig[role].includes(actedOnRole)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
