/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import Cookies from "electrode-cookies";
import {testStore} from "../../../../../src/client/utility/TestingUtils";
import CustomModal from "../../../../../src/client/components/custom-components/modal/custom-modal";
import profile from "../../../mocks/userProfile";
import Http from "../../../../../src/client/utility/Http";
import MODALSMETA from "../../../../../src/client/config/modals-meta";
import FORMFIELDMETA from "../../../../../src/client/config/formsConfig/form-field-meta";
import applicationDetails from "../../../mocks/applicationDetails";
import {mount} from "enzyme";

let store;
jest.mock("electrode-cookies");

const setUpRender = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    company: {onboardingDetails: applicationDetails},
    user: {profile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><CustomModal /></BrowserRouter></Provider>);
};

describe("CustomModal test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

  it("should render the CustomModal successfully", () => {

  });
});
