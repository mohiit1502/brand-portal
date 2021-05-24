import {DISPATCH_WEB_FORM_STATE} from "../../actions/webform/webform-action";

const initialState =  {
 state: "0"
};

const helpReducer = (store = initialState, action) => {
  switch (action.type) {
    case DISPATCH_WEB_FORM_STATE:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default helpReducer;
