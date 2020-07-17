import { combineReducers } from "redux";
import {modal} from "./modal-reducers";
import {userEdit, userProfile} from "./user/user-reducers";
import {brandEdit} from "./brand/brand-reducers";
import claims from "./claim/claim-reducers";
import {notification} from "./notification/notification-reducers";

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

  }
  return store || {};
};


export default combineReducers({
  userRegistration,
  modal,
  userEdit,
  userProfile,
  brandEdit,
  claims,
  notification
});
