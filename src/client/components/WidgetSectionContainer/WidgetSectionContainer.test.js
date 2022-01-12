import React, {useRef} from "react";
import WidgetSectionContainer from "./WidgetSectionContainer";
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

  });
  return mount(props ? <Provider store={store}><MockNextContext pathname="/help"><WidgetSectionContainer {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><WidgetSectionContainer /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("WidgetSectionContainer", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      authConfig: {},
      data: {},
      fetchComplete: true,
      sections: {},
      userProfile: {},
      widgetCommon: {},
      widgetStack: {}
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
