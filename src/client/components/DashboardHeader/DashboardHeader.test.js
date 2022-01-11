/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import DashboardHeader from "./DashboardHeader";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import moment from "moment";

let props;

const setUp = (props) => {
  return mount(props ? <DashboardHeader {...props} /> : <DashboardHeader />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("DashboardHeader", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      userInfo: {}
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

  });
});
