import {brandEdit} from "../../../src/client/reducers/brand/brand-reducers";

describe("Brand Reducer Tests",() => {
  const initialState = {
    test : "This is a test state"
  };

  it("DISPATCH_BRANDS Test",() => {
    const testBrands = [{id:"test1",name:"Test Brand1"},{id:"test2",name:"Test Brand2"}];
    const dispatchBrandAction = {type:"DISPATCH_BRANDS",value:testBrands};
    const expectedState = {
      ...initialState,
      ...testBrands
    };

    const actualState = brandEdit(initialState,dispatchBrandAction);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("SAVE_BRAND_INITIATED Test",() => {
    const saveBrandInitiatedAction = {type:"SAVE_BRAND_INITIATED"};
    const expectedState = {
      save: true
    };
    const actualState = brandEdit(initialState,saveBrandInitiatedAction);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("SAVE_BRAND_COMPLETED Test",() => {
    const saveBrandCompletedAction = {type:"SAVE_BRAND_COMPLETED"};
    const expectedState = {
      save: false
    };
    const actualState = brandEdit(initialState,saveBrandCompletedAction);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("Default Null store",() => {
    const defaultAction = {type:"test"};
    const expectedState = {
      save: false
    };
    const actualState = brandEdit(null,defaultAction);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("Default Non Empty Store",() => {
    const defaultAction = {type:"test"};
    const expectedState = {
      ...initialState
    };
    const actualState = brandEdit(initialState,defaultAction);
    expect(actualState).toStrictEqual(expectedState);
  });

});
