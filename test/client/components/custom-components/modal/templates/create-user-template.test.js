/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import {Provider} from "react-redux";
import renderer, {act} from "react-test-renderer";
import {mount} from "enzyme";
import Cookies from "electrode-cookies";
import {clearFetchMock, mockFailFetch, mockFetch, testStore} from "../../../../../../src/client/utility/TestingUtils";
import CreateUserTemplate from "../../../../../../src/client/components/custom-components/modal/templates/create-user-template";
import MODALSMETA from "../../../../../../src/client/config/contentDescriptors/modals-meta";
import FORMFIELDMETA from "../../../../../../src/client/config/formsConfig/form-field-meta";
import profile from "../../../../mocks/userProfile";
import CONSTANTS from "../../../../../../src/client/constants/constants";

let store;
let root;
let data;
jest.mock("electrode-cookies");

const setUpRender = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA}
    },
    user: {profile}
  };
  store = testStore(mockStore);
  act(() => {
    root = renderer.create(<Provider store={store}><CreateUserTemplate/></Provider>);
  });
  return root;
};

const setUpMount = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA}
    },
    user: {profile}
  };
  store = testStore(mockStore);
  data = profile;
  return mount(<Provider store={store}><CreateUserTemplate data={data}/></Provider>);
};

describe("CreateUserTemplate test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

  it("should render the CreateUserTemplate successfully", () => {
    wrapper = setUpRender();
    mockFetch({
      data: {
        shouldMap: true,
        "/api/newUser/roles": {roles: [{name: "test-role"}]},
        "/api/newUser/brands": {brands: [{brandName: "test-brand"}]}
      }
    });
    expect(wrapper.toJSON()).toMatchSnapshot();
    act(() => {
      root.update(<Provider store={store}><CreateUserTemplate data={profile}/></Provider>);
    });
    expect(wrapper.toJSON()).toMatchSnapshot();
    wrapper.root.findByProps({className: "close text-white"}).props.onClick();
  });

  it("should trigger the new user workflow successfully", async () => {
    jest.useFakeTimers();
    mockFetch({
      data: {
        shouldMap: true,
        "/api/newUser/roles": {roles: [{name: "Super Admin"}, {name: "Administrator"}, {name: "Reporter"}]},
        "/api/newUser/brands": {brands: [{name: "test-brand", brandName: "test-brand", id: "test-brand"}, {name: "all", brandName: "all", id: "all"}]},
        "/api/users": {brands: [{name: "test-brand", brandName: "test-brand", id: "test-brand"}, {name: "all", brandName: "all", id: "all"}]}
      }
    });
    let wrapper = setUpMount();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    wrapper.update();
    wrapper.find(".close.text-white").at(0).simulate('click');
    wrapper.find(".custom-control-input").at(0).simulate('change');
    wrapper.find(".form-control-emailId").at(0).simulate('change');
    wrapper.find(".form-control-phone").at(0).simulate('change');
    wrapper.find(".form-control-phone").at(0).simulate('change', {target: {value: "56dx", checkValidity: jest.fn()}});
    wrapper.find(".dropdown-item").at(0).simulate('click');
    wrapper.find({type: "checkbox", className: "cursor-pointer my-auto"}).at(0).simulate('change');
    wrapper.find("form.h-100.px-2.pl-0").at(0).simulate('submit');
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("should trigger the new user workflow and fail", async () => {
    mockFetch({
      data: {
        shouldMap: true,
        "/api/newUser/roles": {roles: [{name: "Super Admin"}, {name: "Administrator"}, {name: "Reporter"}]},
        "/api/newUser/brands": {brands: [{name: "test-role", brandName: "test-role", id: "test-role"}, {name: "all", brandName: "all", id: "all"}]},
        "/api/users": undefined
      }
    });
    const mockStore = {
      content: {metadata: {...MODALSMETA, ...FORMFIELDMETA}},
      user: {profile}
    };
    store = testStore(mockStore);
    wrapper = mount(<Provider store={store}><CreateUserTemplate /></Provider>);
    wrapper.find(".dropdown-item").at(0).simulate('click');
    wrapper.update()
    wrapper.find("form.h-100.px-2.pl-0").at(0).simulate('submit');
  });

  it("should trigger the update workflow with failure", async () => {
    const formFieldMeta = JSON.parse(JSON.stringify(FORMFIELDMETA));
    formFieldMeta.FORMSCONFIG.NEWUSER.formConfig.isUpdateTemplate = true;
    mockFailFetch();
    const mockStore = {
      content: {metadata: {...MODALSMETA, ...formFieldMeta}},
      user: {profile}
    };
    store = testStore(mockStore);
    wrapper = mount(<Provider store={store}><CreateUserTemplate data={data}/></Provider>);
    wrapper.find("form.h-100.px-2.pl-0").at(0).simulate('submit');
  });

  it("should trigger the update workflow", async () => {
    const formFieldMeta = JSON.parse(JSON.stringify(FORMFIELDMETA));
    formFieldMeta.FORMSCONFIG.NEWUSER.formConfig.isUpdateTemplate = true;
    mockFetch({data: {brands: [{name: "test-role", brandName: "test-role", id: "test-role"}, {name: "all", brandName: "all", id: "all"}]}});
    const mockStore = {
      content: {metadata: {...MODALSMETA, ...formFieldMeta}},
      user: {profile}
    };
    store = testStore(mockStore);
    wrapper = mount(<Provider store={store}><CreateUserTemplate data={data}/></Provider>);
    wrapper.find("form.h-100.px-2.pl-0").at(0).simulate('submit');
  })
});
