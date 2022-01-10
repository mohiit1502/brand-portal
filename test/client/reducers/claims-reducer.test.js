import claimReducer from "./../../../src/client/reducers/claim/claim-reducers";
import {dispatchClaims} from "../../../src/client/actions/claim/claim-actions";

describe("Claim Reducer Test",() => {

  const initialState = {
    test: "This is a test State"
  };

  it("DISPATCH_CLAIMS Test",() => {
    const testClaims = [{id:"test1",claimType:"Test1"},{id:"test2",claimType:"Test2"}]
    const dispatchClaimsAction = dispatchClaims(testClaims);
    const expectedState = {
      ...initialState,
      ...testClaims
    };

    const actualState = claimReducer(initialState,dispatchClaimsAction);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("Default Null Store Test",() => {
    const defaultAction = {type:"TEST_ACTION"};
    const expectedState = {};

    const actualState = claimReducer(null,defaultAction);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("Default Non-Empty Store Test",() => {
    const defaultAction = {type:"TEST_ACTION"};
    const expectedState = {
      ...initialState,
    };

    const actualState = claimReducer(initialState,defaultAction);
    expect(actualState).toStrictEqual(expectedState);
  })


})
