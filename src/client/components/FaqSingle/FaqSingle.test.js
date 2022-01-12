import React, {useRef} from "react";
import FaqSingle from "./FaqSingle";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return mount(props ? <Provider store={store}><MockNextContext pathname="/help"><FaqSingle {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><FaqSingle /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("FaqSingle", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      data: {},
      history: {},
      expandPreState: true,
      toggleImageViewerDispatcher: () => {},
      goToContactUs: () => {}
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
