/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import WebformCta from "./WebformCta";
import renderer from "react-test-renderer";
import webformCtaContent from "../../../../test/client/mocks/webformCtaContent";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";

const setUp = (props) => {
  return mount(props ? <WebformCta {...props} /> : <WebformCta />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("WebformCta", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

   it("renders without error", () => {
     const mRef = {current: document.createElement("div")};
     useRef.mockReturnValue(mRef);
     wrapper = setUp({configuration: webformCtaContent,getContent : jest.fn()});
     const tree = toJson(wrapper);
     expect(tree).toMatchSnapshot();
   });

});
