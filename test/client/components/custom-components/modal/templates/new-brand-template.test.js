/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import {Provider} from "react-redux";
import renderer, {act} from "react-test-renderer";
import Cookies from "electrode-cookies";
import {mockFailFetch, mockFetch, testStore} from "../../../../../../src/client/utility/TestingUtils";
import NewBrandTemplate from "../../../../../../src/client/components/custom-components/modal/templates/new-brand-template";
import MODALSMETA from "../../../../../../src/client/config/contentDescriptors/modals-meta";
import FORMFIELDMETA from "../../../../../../src/client/config/formsConfig/form-field-meta";
import {mount} from "enzyme";

let store;
let wrapper;
let data = {
  brandId: "temp-brand-id",
  brandName: "test-brand-name",
  trademarkNumber: "test-trademark-number",
  comments: "test-comments"
};
jest.mock("electrode-cookies");

const setUpRender = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    }
  };
  store = testStore(mockStore);
  act(() => {
    wrapper = renderer.create(<Provider store={store}><NewBrandTemplate data={data} /></Provider>);
  });
  return wrapper;
};

const setUpMount = (isUpdate) => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    }
  };
  store = testStore(mockStore);
  return isUpdate ? mount(<Provider store={store}><NewBrandTemplate data={data}/></Provider>) : mount(<Provider store={store}><NewBrandTemplate /></Provider>);
};

describe("NewBrandTemplate test container", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

  it("should render the NewBrandTemplate successfully", () => {
    setUpRender();
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it("should mount and trigger new workflow", async () => {
    jest.useFakeTimers();
    mockFetch({
      data: {
        shouldMap: true,
        "/api/brands": {request: {name: "test-brand-name"}},
        "/api/brands/temp-brand-id": {brandName: "test-brand-name"}
      }
    });
    let wrapper = setUpMount();
    wrapper.update();
    wrapper.find(".close.text-white").at(0).simulate('click');
    wrapper.find(".form-control-brandName").at(0).simulate('change');
    wrapper.find(".form-control-trademarkNumber").at(0).simulate('change', {target: {value: "8787654"}});
    wrapper.find(".form-control-trademarkNumber").at(0).simulate('keypress', {which: 47});
    wrapper.find("form.h-100.px-4").at(0).simulate('submit');
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("should fail new brand workflow", () => {
    mockFailFetch();
    let wrapper = setUpMount();
    wrapper.find("form.h-100.px-4").at(0).simulate('submit');
  });

  it("should mount and trigger update workflow", async () => {
    mockFetch({
      data: {
        shouldMap: true,
        "/api/brands": {request: {name: "test-brand-name"}},
        "/api/brands/temp-brand-id": {brandName: "test-brand-name"}
      }
    });
    let wrapper = setUpMount(true);
    wrapper.find("form.h-100.px-4").at(0).simulate('submit');
  });

  it("should fail update brand workflow", () => {
    mockFailFetch();
    let wrapper = setUpMount(true);
    wrapper.find("form.h-100.px-4").at(0).simulate('submit');
  });
});
