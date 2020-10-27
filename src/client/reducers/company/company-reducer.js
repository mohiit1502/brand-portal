import {DISPATCH_BRAND_STATE, DISPATCH_COMPANY_STATE, DISPATCH_NEW_REQUEST, DISPATCH_STEPS} from "./../../actions/company/company-actions";

const initialState =  {
  steps: [
    {
      order: 1,
      name: "Company Profile",
      complete: true,
      active: true
    },
    {
      order: 2,
      name: "Brand Details",
      complete: false,
      active: false
    }
  ]
};

const companyReducer = (store = initialState, action) => {
  switch (action.type) {
    case DISPATCH_COMPANY_STATE:
    case DISPATCH_BRAND_STATE:
    case DISPATCH_NEW_REQUEST:
    case DISPATCH_STEPS:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default companyReducer;
