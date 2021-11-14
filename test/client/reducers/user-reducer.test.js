import Immutable from "immutable";

import {user,userEdit} from "../../../src/client/reducers/user/user-reducers";

describe("User Reducer Reducer Tests",() => {

  describe("User Reducer Tests",() => {
    const initialState={
      test:"This is test state"
    };


    it("UPDATE_PROFILE Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"UPDATE_PROFILE",value:actionValue};
      let expectedValue={
        ...initialState,
        ...actionValue
      }

      let actualValue = user(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DISPATCH_LOGOUT_URL Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"DISPATCH_LOGOUT_URL",value:actionValue};
      let expectedValue={
        ...initialState,
        ...actionValue
      }

      let actualValue = user(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DEFAULT Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"DEFAULT",value:actionValue};
      let expectedValue={
        ...initialState
      };

      let actualValue = user(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DEFAULT Reducer Test without initial state",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"DEFAULT",value:actionValue};
      let expectedValue={
        ...initialState,
        ...actionValue
      };

      let actualValue = user(null,action);
      expect(actualValue).toStrictEqual({});
    });
  });

  describe("User Edit Reducer Tests",() => {

    const initialState = Immutable.Map({
      testValue:"This is initial state"
    });

    const testInitialState=Immutable.Map({
      formErrors: {},
      formValues: {}
    });


    it("UPDATE_USER_FORM_ERRORS Reducer Test ",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"UPDATE_USER_FORM_ERRORS",value:actionValue};
      let expectedValue=initialState.mergeDeep(actionValue);

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("UPDATE_USER_FORM_ERRORS Reducer Test with undefined initial state",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"UPDATE_USER_FORM_ERRORS",value:actionValue};
      let expectedValue=testInitialState.mergeDeep(actionValue);

      let actualValue = userEdit(undefined,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("UPDATE_USER_FORM_VALUES Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"UPDATE_USER_FORM_VALUES",value:actionValue};
      let expectedValue=initialState.mergeDeep(actionValue);

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DISPATCH_USERS Reducer Test without initial state",() =>{
      let actionValue={
        testValue:"This is test value",
        userList:[{id:"test",name:"Test"},{id:"test2",name:"Test2"}]
      }
      const action={type:"DISPATCH_USERS",value:actionValue};
      let expectedValue=initialState.set("userList",actionValue.userList);

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("SAVE_USER_INITIATED Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"SAVE_USER_INITIATED",value:actionValue};
      let expectedValue=initialState.mergeDeep({save:true});

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("SAVE_USER_COMPLETED Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"SAVE_USER_COMPLETED",value:actionValue};
      let expectedValue=initialState.mergeDeep({save:false});

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DEFAULT Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"DEFAULT",value:actionValue};
      let expectedValue=initialState;

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DEFAULT Reducer Test without initial state",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"DEFAULT",value:actionValue};
      let expectedValue= {
        save:false
      };

      let actualValue = userEdit(null,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

  })
})
