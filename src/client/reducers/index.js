import { combineReducers } from "redux";
import {modal} from "./modal-reducers";
import {userEdit, user} from "./user/user-reducers";
import {brandEdit} from "./brand/brand-reducers";
import company from "./company/company-reducer";
import claims from "./claim/claim-reducers";
import content from "./content/content-reducer";
import dashboard from "./dashboard/dashboard-reducers";
import {notification} from "./notification/notification-reducers";
import webform from "./webform/webform-reducer";

const userRegistration = (store, action) => {
  switch (action.type) {
    case "UPDATE_FIRST_NAME":
      return {...store, ...{ firstName: action.value }};
    case "UPDATE_LAST_NAME":
      return {...store, ...{ lastName: action.value }};
    case "UPDATE_EMAIL":
      return {...store, ...{ email: action.value }};
    case "UPDATE_PHONE":
      return {...store, ...{ phone: action.value }};
    case "LOGIN_ACTION":
      return {...store, action: "login"};
    case "REGISTER_ACTION":
      return {...store, action: "register"};
  }
  return store || {};
};

export default combineReducers({
  webform,
  userRegistration,
  modal,
  userEdit,
  user,
  brandEdit,
  company,
  claims,
  content,
  dashboard,
  notification
});
