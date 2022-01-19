/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {testStore} from "../../../../../../src/client/utility/TestingUtils";
import NewClaimAddedTemplate from "../../../../../../src/client/components/custom-components/modal/templates/new-claim-added-template";

let store;

const setUpRender = () => {
  const mockStore = {};
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><NewClaimAddedTemplate data={{caseNumber: "test-case-number"}}/></Provider>);
};

describe("NewClaimAddedTemplate test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("should render the NewClaimAddedTemplate successfully", () => {
    wrapper = setUpRender();
    expect(wrapper.toJSON()).toMatchSnapshot();
    wrapper.root.findByProps({className: "btn btn-sm btn-block cancel-btn text-primary px-5"}).props.onClick();
    wrapper.root.findByProps({className: "btn btn-sm btn-primary px-5"}).props.onClick();
  });
});
