import React, {useRef} from "react";
import LoginTypeCta from "./LoginTypeCta";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import PropTypes from "prop-types";


let props;
let store;

const setUp = (props) => {
  store = testStore({
    userRegistration:{
      action:{}
    }
  });
  return mount(props ? <Provider store={store}><MockNextContext pathname="/help"><LoginTypeCta {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><LoginTypeCta /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("LoginTypeCta", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      action: "",
      dispatchLoginAction: () => {},
      dispatchRegisterAction: () => {}
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
