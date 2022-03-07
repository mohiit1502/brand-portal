import {Provider} from "react-redux";
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import MODALSMETA from "../../../../../../src/client/config/modals-meta";
import FORMFIELDMETA from "../../../../../../src/client/config/formsConfig/form-field-meta";
import profile from "../../../../mocks/userProfile";
import renderer, {act} from "react-test-renderer";
import Cookies from "electrode-cookies";
import {
  mockFailFetch,
  mockFetch,
  testStore,
  update
} from "../../../../../../src/client/utility/TestingUtils";
import {mount} from "enzyme";
import UserProfile from "../../../../../../src/client/components/home/content-renderer/user/profile/user-profile"

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
  return renderer.create(<Provider store={store}><UserProfile /></Provider>);
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
  return mount(<Provider store={store}><UserProfile /></Provider>);
};

describe("User Profile Test",() => {

  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

  it("Should render without error",() => {
    wrapper = setUpRender();
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it("simulate click",() => {
    wrapper = setUpMount();
    wrapper.find(".reset-password").at(0).simulate("click");
    update(wrapper);
  });

});
