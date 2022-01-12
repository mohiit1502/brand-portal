import React, {useRef} from "react";
import WebformWorkflowDecider from "./WebformWorkflowDecider";
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
    webform: {
      state:{}
    }
  });
  return mount(props ? <Provider store={store}><MockNextContext pathname="/help"><WebformWorkflowDecider {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><WebformWorkflowDecider /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("WebformWorkflowDecider", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      dispatchWebformState: ()=>{},
      webformWorkflow: ""
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
