import React, {useRef} from "react";
import Webform from "./Webform";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import renderer from "react-test-renderer";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return renderer.create(props ? <Provider store={store}><MockNextContext pathname="/help"><Webform {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><Webform /></MockNextContext></Provider>);
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
    props = {
      configuration: {},
      dispatchMetadata: ()=>{},
      dispatchWebformState: ()=>{},
      showNotification: ()=>{},
      toggleModal: ()=>{},
      webformFieldsConfiguration: {}
    };
    wrapper = setUp(props);

    const tree = wrapper.toJSON();
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
