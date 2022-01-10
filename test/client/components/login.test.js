import {testStore} from "../../../src/client/utility/TestingUtils";
import {BrowserRouter} from "react-router-dom";
import Http from "../../../src/client/utility/Http";
import React, {useRef} from "react";
import {Provider} from "react-redux";
import Login from "../../../src/client/components/login/login";
import LOGINCONFIG from "../../../src/client/config/contentDescriptors/landingPageTiles";
import {mount} from "enzyme";
import toJson from "enzyme-to-json";

let store;

const setUp = () => {
  store = testStore({});
  return mount(<Provider store={store}><BrowserRouter><Login /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("login page test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("login Page renders without error", () => {
    it("should render the login page successfully", () => {
      jest.spyOn(Http, "get")
        .mockImplementation(() => Promise.resolve({body: {projectToken:"test-token",enableTracking:true}}))
        .mockImplementation(() => Promise.resolve({body: LOGINCONFIG}));
      const mRef = {current: document.createElement("div")};
      useRef.mockReturnValue(mRef);
      wrapper = setUp();
      const tree = toJson(wrapper);
      expect(tree).toMatchSnapshot();
    });

    it("should render the login page with api failures successfully", () => {
      jest.spyOn(Http, "get")
        .mockImplementation(() => Promise.resolve({body: {}}))
        .mockImplementation(() => Promise.resolve({body: {}}));
      const mRef = {current: document.createElement("div")};
      useRef.mockReturnValue(mRef);
      wrapper = setUp();
      const tree = toJson(wrapper);
      expect(tree).toMatchSnapshot();
    });
  });
});
