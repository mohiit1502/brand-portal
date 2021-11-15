/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {testStore} from "../../utility/TestingUtils";
import Dashboard from "./";
import currentFilters from "../../../../test/client/mocks/currentFilters";
import dashboardData from "../../../../test/client/mocks/dashboardData";
import profile from "../../../../test/client/mocks/userProfile";
import Http from "../../utility/Http";

let store;

const setUp = () => {
  const mockStore = {
    dashboard: {filter: currentFilters},
    user: {profile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><Dashboard /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("Dashboard test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("Dashboard renders without error", () => {
    it("should render the dashboard successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: dashboardData}));
      const mRef = {current: document.createElement("div")};
      useRef.mockReturnValue(mRef);
      wrapper = setUp();
      const tree = wrapper.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
