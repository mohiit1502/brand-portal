import React, {useRef} from "react";
import Webform from "./Webform";
import toJson from "enzyme-to-json";
import {configure, mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import renderer from "react-test-renderer";
import Adapter from "enzyme-adapter-react-16";
import Http from "../../utility/Http";

configure({adapter: new Adapter()});

let props;
let store;

const setUp = (props) => {
  store = testStore({modal: {}});
  return renderer.create(props ? <Provider store={store}><MockNextContext pathname="/help"><Webform {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><Webform /></MockNextContext></Provider>);
};

const setUpMounted = () => {
  const mockStore = {
    modal: {}
  };
  store = testStore(mockStore);
  return mount(<Provider store={store}><Webform/></Provider>);
};

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
    // expect(tree).toMatchSnapshot();
  });
  it("renders the Webform without error", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
    wrapper = setUpMounted();
    toJson(wrapper);
    // expect(tree).toMatchSnapshot();
  });
});
