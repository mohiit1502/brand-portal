import {notification} from "../../../src/client/reducers/notification/notification-reducers";

describe("Notification Reducer Test",() => {

  let initialState;
  beforeEach(() => {
    initialState={
      test:"This is test state"
    };
  })

  it("SHOW_NOTIFICATION Action Test",() => {
    const actionValue={testValue:"This is test value"};
    const action={type:"SHOW_NOTIFICATION",value:actionValue};
    const expectedValue = {
      ...actionValue,
      show: true
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("HIDE_NOTIFICATION Action Test",() => {
    const actionValue={testValue:"This is test value"};
    const action={type:"HIDE_NOTIFICATION",value:actionValue};
    const expectedValue = {
      ...actionValue,
      show: false
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DEFAULT Action Test",() => {
    const actionValue={testValue:"This is test value"};
    const action={type:"DEFAULT",value:actionValue};
    const expectedValue = {
      ...initialState
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("DEFAULT Action Test without initial state",() => {
    const actionValue={testValue:"This is test value"};
    const action={type:"DEFAULT",value:actionValue};
    const expectedValue = {
      show: false
    };

    const actualValue = notification(null,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });
})
