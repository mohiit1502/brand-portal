/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import WebformCta from "./WebformCta";
import renderer from "react-test-renderer";
import ApplicationDetails from "../ApplicationDetails";
import Http from "../../utility/Http";
import applicationDetails from "../../../../test/client/mocks/applicationDetails";
import userProfile from "../../../../test/client/mocks/userProfile";
import org from "../../../../test/client/mocks/org";
import brand from "../../../../test/client/mocks/brand";
import webformCtaContent from "../../../../test/client/mocks/webformCtaContent";

const setUp = (props) => {
  return renderer.create(props ? <WebformCta {...props} /> : <WebformCta />);
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
     wrapper = setUp({configuration: webformCtaContent});
     const tree = wrapper.toJSON();
     expect(tree).toMatchSnapshot();
   });

});
