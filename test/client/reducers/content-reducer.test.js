import contentReducer from "./../../../src/client/reducers/content/content-reducer";
import {toggleImageViewer,dispatchFormFieldMetadata,dispatchModalsMetadata} from "../../../src/client/actions/content/content-actions";

describe("Content Reducer tests",() => {

  const initialState = {
    test : "This is a test initial state"
  };

  const testInitialState =  {
    viewerState: {show: false, imageSrc: ""}
  };

  it("TOGGLE_IMAGE_VIEWER Action Test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = toggleImageViewer(actionValue);
    const expectedState = {
      ...initialState,
      viewerState:actionValue,
      metadata: {}
    };

    const actualState = contentReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_META_DATA Action Test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = dispatchFormFieldMetadata(actionValue);
    const expectedState = {
      ...initialState,
      metadata:actionValue
    };

    const actualState = contentReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DISPATCH_MODAL_META_DATA Action Test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = dispatchModalsMetadata(actionValue);
    const expectedState = {
      ...initialState,
      metadata:actionValue
    };

    const actualState = contentReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("TOGGLE_IMAGE_VIEWER Action Test with undefined initial state",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"TOGGLE_IMAGE_VIEWER",value:actionValue};
    const expectedState = {
      ...testInitialState,
      ...actionValue,
      metadata:{}
    };

    const actualState = contentReducer(undefined,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DEFAULT Action Test with non empty state",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedState = {
      ...initialState
    };

    const actualState = contentReducer(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DEFAULT Action Test",() => {
    const actionValue = {testValue:"This is test action value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedState = {};

    const actualState = contentReducer(null,action);
    expect(actualState).toStrictEqual(expectedState);
  });



});
