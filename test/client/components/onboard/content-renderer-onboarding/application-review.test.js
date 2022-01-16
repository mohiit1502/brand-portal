/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer from "react-test-renderer";
import Cookies from "electrode-cookies";
import jquery from "jquery";
import {testStore} from "../../../../../src/client/utility/TestingUtils";
import ApplicationReview from "../../../../../src/client/components/onboard/content-renderer-onboarding/application-review";
import profile from "../../../mocks/userProfile";
import Http from "../../../../../src/client/utility/Http";
import MODALSMETA from "../../../../../src/client/config/modals-meta";
import FORMFIELDMETA from "../../../../../src/client/config/formsConfig/form-field-meta";
import applicationDetails from "../../../mocks/applicationDetails";
import {mount} from "enzyme";

let store;
jest.mock("electrode-cookies");
jest.unmock("jquery")

const setUpRender = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    company: {onboardingDetails: applicationDetails},
    user: {profile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><BrowserRouter><ApplicationReview /></BrowserRouter></Provider>);
};

const setUpMount = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    company: {onboardingDetails: applicationDetails},
    user: {profile}
  };
  store = testStore(mockStore);
  return mount(<Provider store={store}><BrowserRouter><ApplicationReview /></BrowserRouter></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("ApplicationReview test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

  it("should render the ApplicationReview successfully", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
    const mRef = {current: document.createElement("div")};
    useRef.mockReturnValue(mRef);
    wrapper = setUpRender();
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
