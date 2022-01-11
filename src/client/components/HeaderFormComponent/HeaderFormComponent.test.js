/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import HeaderFormComponent from "./HeaderFormComponent";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import PropTypes from "prop-types";

let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return mount(props ? <Provider store={store}><MockNextContext pathname="/dashboard"><HeaderFormComponent {...props} /> </MockNextContext></Provider>: <Provider store={store}><MockNextContext><HeaderFormComponent /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("HeaderFormComponent", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      colClasses: "",
      containerClasses: "",
      header: ""
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
