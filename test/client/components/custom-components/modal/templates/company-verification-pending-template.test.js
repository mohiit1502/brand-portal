/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {testStore} from "../../../../../../src/client/utility/TestingUtils";
import CompanyVerificationPendingTemplate from "../../../../../../src/client/components/custom-components/modal/templates/company-verification-pending-template";

let store;

const setUpRender = () => {
  const mockStore = {
  user: {
    logoutUrl: "test"
  }};
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><CompanyVerificationPendingTemplate modal={{}}/></Provider>);
};

describe("CompanyVerificationPendingTemplate test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("should render the CompanyVerificationPendingTemplate successfully", () => {
    wrapper = setUpRender();
    expect(wrapper.toJSON()).toMatchSnapshot();
    wrapper.root.findByProps({className: "btn btn-sm btn-outline-primary px-5"}).props.onClick();
  });
});
