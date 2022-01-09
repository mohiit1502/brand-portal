import currentFilters from "../mocks/currentFilters";
import profile from "../mocks/userProfile";
import {testStore} from "../../../src/client/utility/TestingUtils";
import renderer from "react-test-renderer";
import {BrowserRouter} from "react-router-dom";
import Dashboard from "../../../src/client/components/Dashboard";
import Http from "../../../src/client/utility/Http";
import dashboardData from "../mocks/dashboardData";
import React, {useRef} from "react";
import {Provider} from "react-redux";
import Login from "../../../src/client/components/login/login";
import LOGINCONFIG from "../../../src/client/config/contentDescriptors/landingPageTiles";

let store;

const setUp = () => {
  store = testStore({});
  return renderer.create(<Provider store={store}><BrowserRouter><Login /></BrowserRouter></Provider>);
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
      const tree = wrapper.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("should render the login page with api failures successfully", () => {
      jest.spyOn(Http, "get")
        .mockImplementation(() => Promise.resolve({body: {}}))
        .mockImplementation(() => Promise.resolve({body: {}}));
      const mRef = {current: document.createElement("div")};
      useRef.mockReturnValue(mRef);
      wrapper = setUp();
      const tree = wrapper.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
