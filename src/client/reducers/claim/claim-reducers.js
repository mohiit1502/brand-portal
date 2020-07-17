import {DISPATCH_CLAIMS} from "./../../actions/claim/claim-actions";

const claimReducer = (store, action) => {
  switch (action.type) {
    case DISPATCH_CLAIMS: {
      return {...store, ...action.value};
    }
    default: {
      return store || { };
    }
  }
};

export default claimReducer;
