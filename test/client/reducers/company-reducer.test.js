import companyReducer from "./../../../src/client/reducers/company/company-reducer"

describe("Company Reducer Tests",() => {

  const initialState = {
    test:"This is test initial state"
  };

  const testInitialState =  {
    steps: [
      {
        order: 1,
        name: "Company Info",
        complete: true,
        active: true
      },
      {
        order: 2,
        name: "Brand Info",
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
    const action = {type:"DISPATCH_COMPANY_STATE",value:actionValue};
    const expectedState = {
      ...initialState,
      ...actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_BRAND_STATE Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = {type:"DISPATCH_BRAND_STATE",value:actionValue};
    const expectedState = {
      ...initialState,
      ...actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_NEW_REQUEST Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = {type:"DISPATCH_NEW_REQUEST",value:actionValue};
    const expectedState = {
      ...initialState,
      ...actionValue
    };

    const actualState = companyReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_STEPS Action Test with state",() => {
    const actionValue = {testValue:"Test company state dispatch value"};
    const action = {type:"DISPATCH_STEPS",value:actionValue};
    const expectedState = {
      ...initialState,
      ...actionValue
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
