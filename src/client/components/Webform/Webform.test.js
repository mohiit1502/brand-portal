/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import Webform from "./Webform";
import {Provider} from "react-redux";
import currentFilters from "../../../../test/client/mocks/currentFilters";
import profile from "../../../../test/client/mocks/userProfile";
import {testStore} from "../../utility/TestingUtils";
import renderer from "react-test-renderer";
import {BrowserRouter} from "react-router-dom";
import Dashboard from "../Dashboard";
import Http from "../../utility/Http";
import dashboardData from "../../../../test/client/mocks/dashboardData";
import FORMFIELDCONFIG from "../../config/formsConfig/form-field-meta";

let store;

const setUp = () => {
  const mockStore = {
    loader: true
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><Webform /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});


describe("Webform", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
   it("renders without error", () => {
     jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: FORMFIELDCONFIG}));
     const mRef = {current: document.createElement("div")};
     useRef.mockReturnValue(mRef);
     wrapper = setUp();
     const tree = wrapper.toJSON();
     expect(tree).toMatchSnapshot();
   });

   it("renders onClick", () => {
     jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: FORMFIELDCONFIG}));
     const mRef = {current: document.createElement("div")};
     useRef.mockReturnValue(mRef);
     wrapper = setUp();
     const tree = wrapper.toJSON();
     expect(tree).toMatchSnapshot();
   });
});
