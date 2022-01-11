import Immutable from "immutable";

import {user,userEdit} from "../../../src/client/reducers/user/user-reducers";
import {saveUserInitiated,saveUserCompleted,updateUserProfile,dispatchLogoutUrl,updateFormValues,updateFormErrors,dispatchUsers} from "../../../src/client/actions/user/user-actions";

describe("User Reducer Reducer Tests",() => {

  describe("User Reducer Tests",() => {
    const initialState={
      test:"This is test state"
    };


    it("UPDATE_PROFILE Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action=updateUserProfile(actionValue);
      let expectedValue={
        ...initialState,
        profile:actionValue
      }

      let actualValue = user(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DISPATCH_LOGOUT_URL Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action=dispatchLogoutUrl(actionValue);
      let expectedValue={
        ...initialState,
        logoutUrl:actionValue
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

    const initialStateMap = Immutable.Map({
      testValue:"This is initial state"
    });
    const initialState = {
      testValue:"This is initial state"
    };

    const testInitialState=Immutable.Map({
      formErrors: {},
      formValues: {}
    });


    it("UPDATE_FORM_ERRORS Reducer Test ",() =>{
      let actionValue = {testValue:"This is test value"}
      const action=updateFormErrors(actionValue)
      let expectedValue={
        ...initialState
      }

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("UPDATE_USER_FORM_ERRORS Reducer Test ",() =>{
      let actionValue = {testValue:"This is test value"}
      const action={type:"UPDATE_USER_FORM_ERRORS",value:actionValue};
      let expectedValue=initialStateMap.mergeDeep(actionValue);

      let actualValue = userEdit(initialStateMap,action);
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
      let expectedValue=initialStateMap.mergeDeep(actionValue);

      let actualValue = userEdit(initialStateMap,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("UPDATE_USER_VALUES Reducer Test",() =>{
      let actionValue = {testValue:"This is test value"}
      const action=updateFormValues(actionValue)

      let expectedValue= {
        ...initialState
      };

      let actualValue = userEdit(initialState,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("DISPATCH_USERS Reducer Test without initial state",() =>{
      let actionValue={
        testValue:"This is test value",
        userList:[{id:"test",name:"Test"},{id:"test2",name:"Test2"}]
      }
      const action=dispatchUsers(actionValue);
      let expectedValue=initialStateMap.set("userList",actionValue.userList);

      let actualValue = userEdit(initialStateMap,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("SAVE_USER_INITIATED Reducer Test",() =>{
      const action=saveUserInitiated();
      let expectedValue=initialStateMap.mergeDeep({save:true});

      let actualValue = userEdit(initialStateMap,action);
      expect(actualValue).toStrictEqual(expectedValue);
    });

    it("SAVE_USER_COMPLETED Reducer Test",() =>{
      const action=saveUserCompleted();
      let expectedValue=initialStateMap.mergeDeep({save:false});

      let actualValue = userEdit(initialStateMap,action);
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
