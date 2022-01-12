/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {configure, mount} from "enzyme";
import {clearKeys, realStore} from "../../../../../../src/client/utility/TestingUtils";
import BrandList from "../../../../../../src/client/components/home/content-renderer/brand/brand-list";
import profile from "../../../../mocks/userProfile";
import Http from "../../../../../../src/client/utility/Http";
import MockNextContext from "../../../../utility/MockNextContext";
import currentFilters from "../../../../mocks/currentFilters";
import Adapter from "enzyme-adapter-react-16";
import BRAND_LIST from "../../../../mocks/brands-list.dummy";

configure({ adapter: new Adapter() });
let store;

const setUp = () => {
  const mockStore = {
    dashboard: {
      filter: currentFilters,
      widgetAction: ""
    },
    claims: {
      claimList: [],
      fetchClaimsCompleted: false
    },
    modal: {},
    user: {profile},
    brandEdit: {
      brandList: [
        {}, {}
      ]
    }
  };
  store = realStore(mockStore);
  // ClaimList.prototype.setState = ({}, callback) => callback && callback();
  return mount(<Provider store={store}><MockNextContext pathname="/brands"><BrandList /></MockNextContext></Provider>);
};

describe("BrandList test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("BrandList renders without error", () => {
    it("should render the BrandList successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      wrapper = setUp();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
    });
    it("should trigger brand filter actions", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp()
      wrapper.find(".clear-btn").at(0).simulate("click");
      wrapper.find(".apply-btn").at(0).simulate("click");
    })
    it("should initiate search", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp()
      wrapper.find("#search-box").at(0).simulate("change");
    });
    it("should add filter", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      wrapper = setUp();
      setTimeout(() => wrapper.find(".form-check-input").at(0).simulate("change"), 10);
    });
    it("tests for scenario when backend sends error", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {errors: ["error"]}}));
      wrapper = setUp();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    });
  });
});
