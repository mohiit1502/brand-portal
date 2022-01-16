/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {testStore} from "../../../../../../src/client/utility/TestingUtils";
import CompanyBrandRegisteredTemplate from "../../../../../../src/client/components/custom-components/modal/templates/company-brand-registered-template";

let store;

const setUpRender = () => {
  const mockStore = {
    user: {logoutUrl: "test"}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><CompanyBrandRegisteredTemplate /></BrowserRouter></Provider>);
};

describe("CompanyBrandRegisteredTemplate test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("should render the CompanyBrandRegisteredTemplate successfully", () => {
    wrapper = setUpRender();
    expect(wrapper.toJSON()).toMatchSnapshot();
    wrapper.root.findByProps({className: "btn btn-sm btn-primary px-5"}).props.onClick();
  });
});
