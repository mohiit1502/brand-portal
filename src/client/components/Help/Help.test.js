/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {testStore} from "../../utility/TestingUtils";
import Help from "./";
import helpData from "../../../../test/client/mocks/helpData";
import Http from "../../utility/Http";

let store;

const setUp = () => {
  store = testStore({});
  return renderer.create(<Provider store={store}><BrowserRouter><Help /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Help", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("should render help successfully", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: helpData}));
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp();
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
