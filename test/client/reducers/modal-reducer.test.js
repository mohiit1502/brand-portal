import {modal} from "../../../src/client/reducers/modal-reducers";

export const DISCARD_CHANGES = "DISCARD_CHANGES";
export const TOGGLE_ACTIONS = {
  SHOW: "show",
  HIDE: "hide"
};

describe("Modal Reducer Tests",() => {

  let initialState={
    enable: false,
    template: null,
    test:"This is test state"
  };

  beforeEach(() => {
    initialState = {
      enable: false,
      template: null,
      test:"This is test state"
    }
  })

  it("DISCARD_CHANGES Action Test",() => {
    const actionValue = {testValue:"This is action value"};
    const action = {type:"DISCARD_CHANGES",value:actionValue};
    const expectedState = {
      ...initialState,
      ...actionValue
    };
    const actualState = modal(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DEFAULT Action Test with initial store",() => {
    const actionValue = {testValue:"This is action value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedState = {
      ...initialState
    };
    const actualState = modal(initialState,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  it("DEFAULT Action Test without initial store",() => {
    const actionValue = {testValue:"This is action value"};
    const action = {type:"DEFAULT",value:actionValue};
    const expectedState = {
      enable: false,
      template: null
    };
    const actualState = modal(null,action);
    expect(actualState).toStrictEqual(expectedState);
  });

  describe("TOGGLE_ACTIONS Action Test",() => {
    it("action.value not present, store enable true,action data present",() => {
      initialState={
        ...initialState,
        enable: true,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL",data:"This is test Data"};
      const expectedState = {
        enable:false,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value not present, store enable true,action data not present",() => {
      initialState={
        ...initialState,
        enable: true,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL"};
      const expectedState = {
        enable:false,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value not present, store enable false,action data present",() => {
      initialState={
        ...initialState,
        enable: false,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL",data:"This is test Data"};
      const expectedState = {
        enable:true,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value not present, store enable false,action data not present",() => {
      initialState={
        ...initialState,
        enable: false,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL"};
      const expectedState = {
        enable:true,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value true,action data present",() => {
      initialState={
        ...initialState,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL",data:"This is test Data",value:"show"};
      const expectedState = {
        enable:true,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value true,action data not present",() => {
      initialState={
        ...initialState,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL",value:"show"};
      const expectedState = {
        enable:true,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value false,action data present",() => {
      initialState={
        ...initialState,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL",value:"hide",data:"This is test Data"};
      const expectedState = {
        enable:false,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

    it("action.value false,action data not present",() => {
      initialState={
        ...initialState,
        shouldDiscard:true
      };
      const action={type:"TOGGLE_MODAL",value:"hide"};
      const expectedState = {
        enable:false,
        shouldDiscard: true,
        ...action
      }

      const actualState = modal(initialState,action);
      expect(actualState).toStrictEqual(expectedState);
    });

  });
});
