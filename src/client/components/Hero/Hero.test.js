/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import Hero from "./Hero";
import {testStore} from "../../utility/TestingUtils";
import {Provider} from "react-redux";
import renderer from "react-test-renderer";
import {BrowserRouter} from "react-router-dom";

let store;
const setUp = () => {

  store = testStore({});
  return renderer.create(
    <Provider store={store}>
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    </Provider>
  );
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Hero Page Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error with details", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp();
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
