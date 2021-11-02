import dashboardReducer from "./../../../src/client/reducers/dashboard/dashboard-reducers";

export const DISPATCH_WIDGET_ACTION = "DISPATCH_WIDGET_ACTION";
export const DISPATCH_FILTER = "DISPATCH_FILTER";
export const DISPATCH_CUSTOM_DATE = "DISPATCH_CUSTOM_DATE";


describe("Dashboard Reducer Test",() => {

  const testInitialState = {
    filter: {},
    widgetAction: false
  };

  const initialState = {
    test:"This is test state"
  };

  it("DISPATCH_WIDGET_ACTION Action test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DISPATCH_WIDGET_ACTION",value:actionValue};
    const expectedValue = {
      ...initialState,
      ...actionValue
    }

    const actualValue = dashboardReducer(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DISPATCH_WIDGET_ACTION Action test Initial State Undefined",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DISPATCH_WIDGET_ACTION",value:actionValue};
    const expectedValue = {
      ...testInitialState,
      ...actionValue
    }

    const actualValue = dashboardReducer(undefined,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DISPATCH_FILTER Action test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DISPATCH_FILTER",value:actionValue};
    const expectedValue = {
      ...initialState,
      ...actionValue
    }

    const actualValue = dashboardReducer(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DISPATCH_CUSTOM_DATE Action test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DISPATCH_CUSTOM_DATE",value:actionValue};
    const expectedValue = {
      ...initialState,
      ...actionValue
    }

    const actualValue = dashboardReducer(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DEFAULT Action test with initial store",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedValue = {
      ...initialState
    };

    const actualValue = dashboardReducer(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DEFAULT Action test with null store",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedValue = {};

    const actualValue = dashboardReducer(null,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

})
