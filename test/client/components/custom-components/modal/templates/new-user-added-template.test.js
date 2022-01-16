/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import {testStore} from "../../../../../../src/client/utility/TestingUtils";
import NewUserAddedTemplate from "../../../../../../src/client/components/custom-components/modal/templates/new-user-added-template";
import userProfile from "../../../../mocks/userProfile";

let store;

const setUpRender = () => {
  const mockStore = {
    modal: {data: userProfile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><NewUserAddedTemplate /></BrowserRouter></Provider>);
};

describe("NewUserAddedTemplate test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("should render the NewUserAddedTemplate successfully", () => {
    wrapper = setUpRender();
    expect(wrapper.toJSON()).toMatchSnapshot();
    wrapper.root.findByProps({className: "btn btn-sm btn-primary px-5"}).props.onClick();
  });
});
