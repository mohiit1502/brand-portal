import {notification} from "../../../src/client/reducers/notification/notification-reducers";
import {
  showNotification,
  hideNotification,
  NOTIFICATION_TYPE
} from "../../../src/client/actions/notification/notification-actions";

describe("Notification Reducer Test",() => {

  const message = "Test message";
  const variant = "variant";

  let initialState;
  beforeEach(() => {
    initialState={
      test:"This is test state"
    };
  })

  it("SHOW_NOTIFICATION with message,variant1 Action Test",() => {
    const action=showNotification(NOTIFICATION_TYPE.SUCCESS,message,variant)
    const expectedValue = {
      message:message,
      notificationImage: undefined,
      notificationType:"SUCCESS",
      variant:"variant",
      show: true
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("SHOW_NOTIFICATION Action without message and variant Test",() => {
    const action=showNotification(NOTIFICATION_TYPE.SUCCESS)
    const expectedValue = {
      message:"Action Successful",
      notificationImage: undefined,
      notificationType:"SUCCESS",
      variant:"variant1",
      show: true
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("SHOW_NOTIFICATION with failure,message,variant1 Action Test",() => {
    const action=showNotification(NOTIFICATION_TYPE.ERROR,message,variant)
    const expectedValue = {
      message:message,
      notificationImage: undefined,
      notificationType:"ERROR",
      variant:"variant",
      show: true
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("SHOW_NOTIFICATION Action - failure without message and variant Test",() => {
    const action=showNotification(NOTIFICATION_TYPE.ERROR)
    const expectedValue = {
      message:"Action Failed",
      notificationImage: undefined,
      notificationType:"ERROR",
      variant:"variant1",
      show: true
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("HIDE_NOTIFICATION Action with variant Test",() => {
    const actionValue={testValue:"This is test value"};
    const action=hideNotification(variant)
    const expectedValue = {
      variant:"variant",
      show: false
    };

    const actualValue = notification(initialState,action);
    expect(actualValue).toStrictEqual(expectedValue);
  });

  it("HIDE_NOTIFICATION Action Test without variant",() => {
    const actionValue={testValue:"This is test value"};
    const action=hideNotification()
    const expectedValue = {
      variant:"variant1",
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
