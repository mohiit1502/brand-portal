import webformReducer from "./../../../src/client/reducers/webform/webform-reducer";
import {dispatchWebformState} from "../../../src/client/actions/webform/webform-action";

describe("WebForm Reducer Test",() => {

  const initialState = {
    test:"This is test state"
  };

  const testInitialState = {
    state: "1"
  };

  it("DISPATCH_WEB_FORM_STATE Action Test",() =>{
    const actionValue = {testValue:"This is test value"};
    const action = dispatchWebformState(actionValue);
    const expectedValue={
      ...initialState,
      state:actionValue
    };

    const actualValue=webformReducer(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DISPATCH_WEB_FORM_STATE Action Test with undefined initial state",() =>{
    const actionValue = {testValue:"This is test value"};
    const action = dispatchWebformState(actionValue);
    const expectedValue={
      ...testInitialState,
      state:actionValue
    };

    const actualValue=webformReducer(undefined,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DEFAULT Action Test",() =>{
    const actionValue = {testValue:"This is test value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedValue={
      ...initialState
    };

    const actualValue=webformReducer(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DEFAULT Action Test with null initial state",() =>{
    const actionValue = {testValue:"This is test value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedValue={};

    const actualValue=webformReducer(null,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

})
