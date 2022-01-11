/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import FaqContainer from "./FaqContainer";
import {mount} from "enzyme";
import DatePickerWrapper from "../DatePickerWrapper";
import moment from "moment";
import toJson from "enzyme-to-json";
import PropTypes from "prop-types";
import {testStore} from "../../utility/TestingUtils";

const setUp = (props) => {

  return mount(props ? <FaqContainer /> : <FaqContainer />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("FaqContainer", () => {
  it("renders without error", () => {
    let wrapper;
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    wrapper = setUp();

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

  });
});
