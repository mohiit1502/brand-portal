import {DISPATCH_LOGOUT_URL, SAVE_USER_COMPLETED, SAVE_USER_INITIATED, UPDATE_PROFILE} from "./../../actions/user/user-actions";

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

export const userEdit = (store, action) => {
  switch (action.type) {
    case SAVE_USER_INITIATED: {
      return { save: true };
    }
    case SAVE_USER_COMPLETED: {
      return { save: false };
    }
    default: {
      return store ||  {
        save: false
      };
    }
  }
};
