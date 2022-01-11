import React, {useRef} from "react";
import renderer from "react-test-renderer";
import StackedBarChart from "./StackedBarChart";
import toJson from "enzyme-to-json";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return renderer.create(props ? <Provider store={store}><MockNextContext pathname="/help"><StackedBarChart {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><StackedBarChart /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("StackedBarChart", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      chart: {},
      classes: "",
      colors: {},
      containerId: "",
      currentFilter: {},
      data: [],
      keys: []
    };
    wrapper = setUp(props);
    const tree = wrapper.toJSON();
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
