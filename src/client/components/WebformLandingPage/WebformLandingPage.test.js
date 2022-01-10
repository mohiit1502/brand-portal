/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import WebformLandingPage from "./WebformLandingPage";
import renderer from "react-test-renderer";
import webformLandingPage from "../../../../test/client/mocks/webformLandingPage";

const setUp = (props) => {
  return renderer.create(props ? <WebformLandingPage {...props} /> : <WebformLandingPage />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("WebformLandingPage", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

   it("renders without error", () => {
     const mRef = {current: document.createElement("div")};
     useRef.mockReturnValue(mRef);
     wrapper = setUp({configuration: webformLandingPage});
     const tree = wrapper.toJSON();
     expect(tree).toMatchSnapshot();

   });
});
