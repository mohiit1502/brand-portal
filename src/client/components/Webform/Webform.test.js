import "core-js/stable";
import "regenerator-runtime/runtime";
import React, {useRef} from "react";
import {configure, mount} from "enzyme";
import {Provider} from "react-redux";
import renderer from "react-test-renderer";
import Adapter from "enzyme-adapter-react-16";
import {mockFailFetch, mockFetch, testStore, update} from "../../utility/TestingUtils";
import Validator from "../../utility/validationUtil";
import Webform from "./Webform";
import FORMFIELDMETA from "../../config/formsConfig/form-field-meta";
import WEBFORMCONFIG from "../../config/contentDescriptors/webform";

configure({adapter: new Adapter()});

let props;
let store;

const setUpRender = () => {
  const mockStore = {};
  props = {
    configuration: WEBFORMCONFIG.webform,
    dispatchWebformState: ()=>{},
    showNotification: ()=>{},
    toggleModal: ()=>{},
    webformFieldsConfiguration: {}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><Webform {...props} /></Provider>);
};

const setUpMounted = () => {
  const mockStore = {};
  props = {
    configuration: WEBFORMCONFIG.webform,
    dispatchWebformState: ()=>{},
    showNotification: ()=>{},
    toggleModal: ()=>{},
    webformFieldsConfiguration: {}
  };
  store = testStore(mockStore);
  return mount(<Provider store={store}><Webform {...props} /></Provider>);
};

describe("Webform", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    mockFetch({
      data: {
        shouldMap: true,
        "/api/formConfig": FORMFIELDMETA
      }
    });
    wrapper = setUpRender();
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should simulate user journey in Webform without failure", async () => {
    jest.useFakeTimers();
    const productId = 8767654;
    jest.spyOn(Validator, "validateState").mockImplementation(() => false);
    mockFetch({data: {shouldMap: true, "/api/formConfig": FORMFIELDMETA}});
    wrapper = setUpMounted();
    await update(wrapper);
    mockFetch({data: {shouldMap: true, "/api/formConfig": JSON.stringify(FORMFIELDMETA)}});
    wrapper = setUpMounted();
    await update(wrapper);
    wrapper.find(".d-inline-block.anchor-styled.mb-35rem").at(0).simulate('click');
    wrapper.find(".dropdown-item").at(0).simulate('click');
    wrapper.find(".dropdown-item").at(3).simulate('click');
    wrapper.find(".dropdown-item").at(6).simulate('click');
    wrapper.find(".user-undertaking").at(0).simulate('change', {target: {id: "user_undertaking_1"}});
    wrapper.find(".user-undertaking").at(1).simulate('change', {target: {id: "user_undertaking_2"}});
    wrapper.find(".user-undertaking").at(2).simulate('change', {target: {id: "user_undertaking_3"}});
    wrapper.find(".form-control-url-0").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}/`}});
    wrapper.find("#webform-sellerName-0-custom-input").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}/`}});
    wrapper.find("div.btn.btn-sm.btn-block.btn-primary").at(0).simulate('click');
    wrapper.find("button.btn.btn-sm.btn-block.cancel-btn.text-primary").at(0).simulate('click');
    wrapper.find(".form-control-comments").at(0).simulate('change', {target: {value: "comment-12345432-comment"}});
    wrapper.find(".btn.btn-primary.padded-button").at(0).simulate('click');
    mockFailFetch(500);
    wrapper.find(".btn.btn-primary.padded-button").at(0).simulate('click');
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("should fail during webform submission", async () => {
    mockFetch({data: {shouldMap: true, "/api/formConfig": JSON.stringify(FORMFIELDMETA)}});
    wrapper = setUpMounted();
    await update(wrapper);
    wrapper.find(".dropdown-item").at(3).simulate('click');
    wrapper.find(".btn.btn-primary.padded-button").at(0).simulate('click');
  });
});
