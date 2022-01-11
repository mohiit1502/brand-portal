/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import ContactUsPrompt from "./ContactUsPrompt";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import moment from "moment";

let props;

const setUp = (props) => {
  return mount(props ? <ContactUsPrompt {...props} /> : <ContactUsPrompt />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("ContactUsPrompt", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {

    wrapper = setUp();

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

  });
});
