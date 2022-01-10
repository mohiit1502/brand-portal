/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import GroupedBarChart from "./GroupedBarChart";
import GroupedBarChartProps from "../../../../test/client/mocks/groupedBarChartMock";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";

const setUp = (props) => {
  return mount(<GroupedBarChart {...props}/>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Grouped Bar Chart Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(GroupedBarChartProps);

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
