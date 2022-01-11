/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import GenericErrorPage from "./GenericErrorPage";
import renderer from "react-test-renderer";
import GENERICERRORPAGE from "../../../../test/client/mocks/genericErrorPage";

const setUp = (props) => {
  return renderer.create(props ? <GenericErrorPage {...props} /> : <GenericErrorPage />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("GenericErrorPage Tests", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders without error with details", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(GENERICERRORPAGE["withDetails"]);
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders without error without details", () => {
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUp(GENERICERRORPAGE["withoutDetails"]);
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
