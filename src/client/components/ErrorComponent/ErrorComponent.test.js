import React, {useRef} from "react";
import ErrorComponent from "./ErrorComponent";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import moment from "moment";
import PropTypes from "prop-types";

let props;

const setUp = (props) => {
  return mount(props ? <ErrorComponent {...props} /> : <ErrorComponent />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("ErrorComponent", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      containerClasses: "",
      errorClasses: "",
      error: ""
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

  });
});
