/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import LoginTypeCta from "./LoginTypeCta";
import {testStore} from "../../utility/TestingUtils";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import loginTypeCtaMock from "../../../../test/client/mocks/loginTypeCta";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";

let store;
const setUp = (props,bool) => {
  const mockStore = {
    userRegistration :{
      action: "login"
    }
  };
  const mockStore2 = {
    userRegistration :{
    }
  }
  store = testStore(bool ? mockStore : mockStore2);
  return mount(<Provider store={store}><BrowserRouter><LoginTypeCta {...props} /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Login Type CTA FAQ Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(loginTypeCtaMock["noError"],true);
    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });

  it("renders unauthorised", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(loginTypeCtaMock["unauthorised"],false);
    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
