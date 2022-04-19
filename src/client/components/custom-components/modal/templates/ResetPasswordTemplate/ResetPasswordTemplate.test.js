/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import ResetPasswordTemplate from "./ResetPasswordTemplate";
import {Provider} from "react-redux";
import "core-js/stable";
import "regenerator-runtime/runtime";
import MODALSMETA from "../../../../../config/contentDescriptors/modals-meta";
import FORMFIELDMETA from "../../../../../../../src/client/config/formsConfig/form-field-meta";
import profile from "../../../../../../../test/client/mocks/userProfile";
import renderer, {act} from "react-test-renderer";
import Cookies from "electrode-cookies";
import {
  mockFailFetch,
  mockFetch,
  testStore,
  update
} from "../../../../../utility/TestingUtils";
import {mount} from "enzyme";

let store;
jest.mock("electrode-cookies");

const setUpRender = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    user: {profile},
    modal:{shouldDiscard : false}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><ResetPasswordTemplate /></Provider>);
};

const setUpMount = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    user: {profile},
    modal:{shouldDiscard : false}
  };
  store = testStore(mockStore);
  return mount(<Provider store={store}><ResetPasswordTemplate /></Provider>);
};

describe("ResetPasswordTemplate", () => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

   it("renders without error", () => {
     wrapper = setUpRender();
     expect(wrapper.toJSON()).toMatchSnapshot();
   });

   it("trigger event", () => {
     wrapper = setUpMount();
     wrapper.find(".close").at(0).simulate("click");
     update(wrapper)
   });
});
