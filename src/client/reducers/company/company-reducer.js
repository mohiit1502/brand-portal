import {DISPATCH_BRAND_STATE, DISPATCH_COMPANY_STATE, DISPATCH_NEW_REQUEST, DISPATCH_ONBOARDING_DETAILS, DISPATCH_STEPS, DISPATCH_ORIGINAL_VALUES} from "./../../actions/company/company-actions";

const initialState =  {
  steps: [
    {
      order: 1,
      name: "Company Information",
      complete: true,
      active: true
    },
    {
      order: 2,
      name: "Brand Information",
      complete: false,
      active: false
    },
    {
      order: 3,
      name: "Review",
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
    case DISPATCH_ONBOARDING_DETAILS:
    case DISPATCH_ORIGINAL_VALUES:
    case DISPATCH_STEPS:
      return {...store, ...action.value};
    default:
      return store || { };
  }
};

export default companyReducer;
