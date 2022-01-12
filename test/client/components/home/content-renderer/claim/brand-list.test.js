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
import Dropdown from "../../../../../../src/client/components/custom-components/dropdown/dropdown";

configure({adapter: new Adapter()});
let store;

const brandRowData = {
  original: {
    "brandId": "294ba054-9ef1-4df1-8286-05017a7d8fe2",
    "brandName": "Test-brand-833",
    "trademarkNumber": "5912086",
    "dateAdded": "01-10-2022",
    "caseStatus": "ACCEPTED",
    "brandStatus": "Verified",
    "caseId": "294ba054-9ef1-4df1-8286-05017a7d8fe2",
    "usptoUrl": "https://tsdr.uspto.gov/#caseNumber=5912086&caseSearchType=US_APPLICATION&caseType=DEFAULT&searchType=statusSearch",
    "usptoVerification": "VALID",
    "sequence": 3
  }
};

const mockStore = {
  dashboard: {
    filter: currentFilters,
    widgetAction: "test-widget-action"
  },
  modal: {},
  user: {profile},
  brandEdit: {
    brandList: BRAND_LIST.body.content,
    save: true
  }
};
const setUp = (pathname) => {
  store = realStore(mockStore);
  return mount(<Provider store={store}><MockNextContext><BrandList history={{location: {pathname}}}/></MockNextContext></Provider>);
};

describe("BrandList test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe("BrandList renders without error", () => {
    it("should render the BrandList successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      wrapper = setUp("/brands");
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
      jest.spyOn(Http, "get").mockImplementation((url, params, callback) => {
        callback && callback();
        return Promise.resolve(BRAND_LIST);
      });
      setUp("/brands/", store);
    });
    it("should render without claim summary filter", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      let store = JSON.parse(JSON.stringify(mockStore));
      delete store.dashboard.filter["widget-brand-summary"];
      wrapper = setUp("/brands/", store);
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    });
    it("should trigger brand filter actions", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      wrapper = setUp("/brands");
      await Promise.resolve();
      await wrapper.instance().forceUpdate();
      wrapper.update();
      wrapper.find(".clear-btn").at(0).simulate("click");
      wrapper.find(".apply-btn").at(0).simulate("click");
      wrapper.find("FilterType").props().clearFilter("brandName", 1);
    });
    it("should trigger brand ellipsis actions", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      jest.spyOn(Http, "put").mockImplementation((url, payload, params, callback) => {
        callback && callback();
        return Promise.resolve(BRAND_LIST)
      });
      wrapper = setUp("/brands");
      await Promise.resolve();
      await wrapper.instance().forceUpdate();
      wrapper.update();
      const ddProps = wrapper.find("CustomTable").props();
      ddProps.templateProps.dropdownOptions.dropdownOptions[0].clickCallback({}, "", brandRowData);
      ddProps.templateProps.dropdownOptions.dropdownOptions[1].clickCallback({}, "", brandRowData);
    });
    it("should initiate search", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp("/brands");
      wrapper.find("#search-box").at(0).simulate("change");
    });
    it("should add filter", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(BRAND_LIST));
      wrapper = setUp("/brands");
      await Promise.resolve();
      await wrapper.instance().forceUpdate();
      wrapper.update();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".form-check-input").at(0).simulate("change");
      wrapper.find(".form-check-input").at(1).simulate("change");
    });
    it("tests for scenario when backend sends error", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {errors: ["error"]}}));
      wrapper = setUp("/brands");
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    });
  });
});
