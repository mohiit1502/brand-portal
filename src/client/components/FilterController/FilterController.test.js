import React, {useRef} from "react";
import FilterController from "./FilterController";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";


let props;
let store;

const setUp = (props) => {
  store = testStore({
    dashboard:{
      customDate:{}
    }
  });
  return mount(props ? <Provider store={store}><MockNextContext pathname="/help"><FilterController {...props} /></MockNextContext></Provider>: <Provider store={store}><MockNextContext pathname="/help"><FilterController /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("FilterController", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      customDate: {},
      currentFilters: {},
      dispatchFilter: () => {},
      filters: [],
      toggleModal: () => {},
      updateChartMeta: {},
      widgetId: ""
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree,[]);
    expect(tree).toMatchSnapshot();

  });
});
