/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import Footer from "./Footer";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";

let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return mount(props ? <Provider store={store}><MockNextContext pathname="/dashboard"><Footer {...props} /> </MockNextContext></Provider>: <Provider store={store}><MockNextContext><Footer /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("Footer", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      isWebform: false
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
