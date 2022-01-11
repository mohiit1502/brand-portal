/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import LoginFaq from "./LoginFaq";
import renderer from "react-test-renderer";
import faqMock from "../../../../test/client/mocks/faqMock";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {testStore} from "../../utility/TestingUtils";

let store;
const setUp = (props) => {
  const mockStore = {
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><LoginFaq {...props} /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Login FAQ Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(faqMock);
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
