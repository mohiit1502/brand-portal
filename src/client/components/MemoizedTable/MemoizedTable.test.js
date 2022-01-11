import React, {useRef} from "react";
import MemoizedTable from "./MemoizedTable";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import PropTypes from "prop-types";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return shallow(props ? <Provider store={store}><MockNextContext pathname="/help"><MemoizedTable {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><MemoizedTable /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("MemoizedTable", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      classColMap: {},
      columns: [],
      data: [],
      fetchComplete: true,
      template: () => {},
      templateProps: {},
      toggleModal: () => {}
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();
  });
});
