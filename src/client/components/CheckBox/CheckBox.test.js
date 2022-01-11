/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import CheckBox from "./CheckBox";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import moment from "moment";
import PropTypes from "prop-types";

let props;

const setUp = (props) => {
  return mount(props ? <CheckBox {...props} /> : <CheckBox />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});


describe("CheckBox", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      containerClasses: "",
      colClasses: "",
      checkBoxClasses: "",
      error: "",
      id: "",
      label: "",
      labelClasses: "",
      onChange: () => {},
      parentRef: {},
      preventHTMLRequiredValidation: true,
      required: true,
      selected: true,
      tou: true,
      touLink: ""
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

  });
});
