import companyReducer from "./../../../src/client/reducers/company/company-reducer"
import {dispatchCompanyState,dispatchOnboardingDetails,dispatchBrandState,dispatchNewRequest,dispatchOriginalValues,dispatchSteps} from "../../../src/client/actions/company/company-actions";

describe("Company Reducer Tests",() => {

  const initialState = {
    test:"This is test initial state"
  };

  const testInitialState =  {
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

  it("DISPATCH_COMPANY_STATE Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = dispatchCompanyState(actionValue);
    const expectedState = {
      ...initialState,
      companyState: actionValue
    };
    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_ONBOARDING_DETAILS Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = dispatchOnboardingDetails(actionValue);
    const expectedState = {
      ...initialState,
      onboardingDetails: actionValue
    };
    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_BRAND_STATE Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = dispatchBrandState(actionValue);
    const expectedState = {
      ...initialState,
      brandState:actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_NEW_REQUEST Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = dispatchNewRequest(actionValue);
    const expectedState = {
      ...initialState,
      isNew:actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_STEPS Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = dispatchSteps(actionValue)
    const expectedState = {
      ...initialState,
      steps:actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_ORIGINAL_VALUES Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = dispatchOriginalValues(actionValue)
    const expectedState = {
      ...initialState,
      originalValues:actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("Default Action Test without state",() => {
    const action = {type:"DEFAULT_ACTION"};
    const expectedState = {};

    const actualState = companyReducer(null,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_STEPS Action Test without state",() => {
    const actionValue = {testValue: "Test company state dispatch value"};
    const action = {type:"DISPATCH_STEPS",value: actionValue};
    const expectedState = {
      ...testInitialState,
      ...actionValue
    };

    const actualState = companyReducer(undefined, action);
    expect(actualState).toStrictEqual(expectedState);
  });


})
