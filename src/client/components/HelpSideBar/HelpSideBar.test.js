/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import HelpSideBar from "./HelpSideBar";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";
import helpSideBarMock from "../../../../test/client/mocks/helpSideBarMock";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";

const setUp = (props) => {
  return mount(<BrowserRouter><HelpSideBar {...props}/></BrowserRouter>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Help Side Bar Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(helpSideBarMock);

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
