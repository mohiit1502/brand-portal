/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import renderer, {act} from "react-test-renderer";
import Cookies from "electrode-cookies";
import {mount} from "enzyme";
import {
  mockFailFetch,
  mockFetch,
  testStore,
  update
} from "../../../../../../src/client/utility/TestingUtils";
import NewClaimTemplate from "../../../../../../src/client/components/custom-components/modal/templates/new-claim-template";
import MODALSMETA from "../../../../../../src/client/config/modals-meta";
import FORMFIELDMETA from "../../../../../../src/client/config/formsConfig/form-field-meta";
import profile from "../../../../mocks/userProfile";

let store;
jest.mock("electrode-cookies");

const setUpRender = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    user: {profile}
  };
  store = testStore(mockStore);
  return renderer.create(<Provider store={store}><NewClaimTemplate /></Provider>);
};

const setUpMount = () => {
  const mockStore = {
    content: {
      metadata: {...MODALSMETA, ...FORMFIELDMETA},
    },
    user: {profile}
  };
  store = testStore(mockStore);
  return mount(<Provider store={store}><NewClaimTemplate /></Provider>);
};

describe("NewClaimTemplate test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    Cookies.get.mockImplementation(jest.fn());
  });

  it("should render the NewClaimTemplate successfully", () => {
    wrapper = setUpRender();
    mockFetch({
      data: {
        shouldMap: true,
        "/api/claims": {data: {content: [{firstName: "test-claim", lastName: "test-last-name"}]}},
        "/api/brands?brandStatus=ACCEPTED": {content: {brands: [{brandId: "test-brand-id", brandName: "test-role", usptoUrl: "test-uspto-url", usptoVerification: "Verified"}]}},
        "/api/sellers": [{value: "seller-1"}, {value: "seller-2"}]
      }
    });
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it("should trigger the create claim workflow successfully", async () => {
    jest.useFakeTimers();
    const productId = 8767654;
    mockFetch({
      data: {
        shouldMap: true,
        "/api/claims": {data: {content: [{firstName: "test-claim", lastName: "test-last-name"}]}},
        "/api/brands?brandStatus=ACCEPTED": {content: [{brandId: "test-brand-id", brandName: "test-brand", usptoUrl: "test-uspto-url", usptoVerification: "Verified"}]},
        [`/api/sellers?payload=${productId}`]: [{value: "seller-1"}, {value: "seller-2"}]
      }
    });
    wrapper = setUpMount();
    wrapper.find(".close.text-white").at(0).simulate('click');
    await update(wrapper);
    wrapper.find(".dropdown-item").at(0).simulate('click');
    wrapper.find(".dropdown-item").at(1).simulate('click');
    wrapper.find(".user-undertaking").at(0).simulate('change', {target: {id: "user_undertaking_1"}});
    wrapper.find(".user-undertaking").at(1).simulate('change', {target: {id: "user_undertaking_2"}});
    wrapper.find(".user-undertaking").at(2).simulate('change', {target: {id: "user_undertaking_3"}});
    // wrapper.find(".user-undertaking").at(3).simulate('change', {target: {id: "user_undertaking_1"}});
    wrapper.find(".form-control-url-0").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}`}});
    jest.runAllTimers();
    await update(wrapper);
    wrapper.find({type: "checkbox", className: "cursor-pointer my-auto"}).at(0).simulate('change', {target: {value: "All", checked: true}});
    jest.runAllTimers();
    await update(wrapper);
    wrapper.find("form.h-100").at(0).simulate('submit');
    // leftovers
    wrapper.find(".dropdown-item").at(4).simulate('click');
    wrapper.find("div.btn.btn-sm.btn-block.btn-primary").at(0).simulate('click');
    wrapper.find("button.btn.btn-sm.btn-block.cancel-btn.text-primary").at(0).simulate('click');
    wrapper.find(".form-control-comments").at(0).simulate('change', {target: {value: "comment-12345432-comment"}});
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("should trigger new claim workflow and fail", async () => {
    jest.useFakeTimers();
    const productId = 8767654;
    mockFetch({
      data: {
        shouldMap: true,
        "/api/claims": {data: {content: [{firstName: "test-claim", lastName: "test-last-name"}]}},
        "/api/brands?brandStatus=ACCEPTED": {content: [{brandId: "test-brand-id", brandName: "test-brand", usptoUrl: "test-uspto-url", usptoVerification: "Verified"}]},
        [`/api/sellers?payload=${productId}`]: [{value: "seller-1"}, {value: "seller-2"}]
      }
    });
    wrapper = setUpMount();
    await update(wrapper);
    wrapper.find(".dropdown-item").at(0).simulate('click');
    wrapper.find(".form-control-url-0").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}/`}});
    await update(wrapper);
    mockFailFetch(500);
    wrapper.find(".form-control-url-0").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}/`}});
    wrapper.find("form.h-100").at(0).simulate('submit');
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("calls IQS and fails", async () => {
    jest.useFakeTimers();
    const productId = 8767654;
    mockFetch({
      data: {
        shouldMap: true,
        "/api/claims": {data: {content: [{firstName: "test-claim", lastName: "test-last-name"}]}},
        "/api/brands?brandStatus=ACCEPTED": {content: [{brandId: "test-brand-id", brandName: "test-brand", usptoUrl: "test-uspto-url", usptoVerification: "Verified"}]},
        [`/api/sellers?payload=${productId}`]: []
      }
    });
    wrapper = setUpMount();
    await update(wrapper);
    wrapper.find(".dropdown-item").at(0).simulate('click');
    wrapper.find(".form-control-url-0").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}/`}});
    await update(wrapper);
    mockFailFetch(389);
    wrapper.find(".form-control-url-0").at(0).simulate('change', {target: {value: `https://walmart.com/${productId}/`}});
    jest.runAllTimers();
    jest.useRealTimers();
  })
});
