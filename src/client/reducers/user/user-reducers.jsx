import {
  DISPATCH_LOGOUT_URL,
  SAVE_USER_COMPLETED,
  SAVE_USER_INITIATED,
  UPDATE_PROFILE,
  UPDATE_FORM_ERRORS,
  UPDATE_FORM_VALUES,
  DISPATCH_USERS
} from "../../actions/user/user-actions";
import Immutable from "immutable"

const initialState = Immutable.Map({
  formErrors: {},
  formValues: {}
});

export const user = (store, action) => {
  const storeData = action.value;
  switch (action.type) {
    case UPDATE_PROFILE:
    case DISPATCH_LOGOUT_URL:
      return { ...store, ...storeData };
    default: {
      return store ||  { };
    }
  }
};

export const userEdit = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORM_ERRORS:
    case UPDATE_FORM_VALUES:
      return state.mergeDeep(action.value);
    case DISPATCH_USERS:
      return state.set("userList", action.value.userList)
    case SAVE_USER_INITIATED: {
      return state.mergeDeep({ save: true });
    }
    case SAVE_USER_COMPLETED: {
      return state.mergeDeep({ save: false });
    }
    default: {
      return state ||  {
        save: false
      };
    }
  }
};
