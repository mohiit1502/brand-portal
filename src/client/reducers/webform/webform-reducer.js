import {DISPATCH_WEB_FORM_STATE} from "../../actions/webform/webform-action";

const initialState =  {
 state: "1"
};

const webformReducer = (store = initialState, action) => {
  switch (action.type) {
    case DISPATCH_WEB_FORM_STATE:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default webformReducer;
