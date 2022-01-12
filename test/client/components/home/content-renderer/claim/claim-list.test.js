/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {configure, mount, unmount} from "enzyme";
import TestRenderer from "react-test-renderer";
import {clearKeys, realStore} from "../../../../../../src/client/utility/TestingUtils";
import ClaimList from "../../../../../../src/client/components/home/content-renderer/claim/claim-list";
import profile from "../../../../mocks/userProfile";
import Http from "../../../../../../src/client/utility/Http";
import currentFilters from "../../../../mocks/currentFilters";
import Adapter from "enzyme-adapter-react-16";
import MockNextContext from "../../../../utility/MockNextContext";
import CLAIM_LIST from "../../../../mocks/claims-list.dummy";

configure({ adapter: new Adapter() });
let store;
const mockStore = {
  dashboard: {
    filter: currentFilters,
    widgetAction: "test-widget-action"
  },
  claims: {
    claimList: CLAIM_LIST.body.data.content,
    fetchClaimsCompleted: true
  },
  modal: {},
  user: {profile}
};

let renderComp;
const setUp = (pathname, mockStore) => {
  store = realStore(mockStore);
  let wrapper;
  const {act} = TestRenderer;
  renderComp = <Provider store={store}><MockNextContext><ClaimList history={{location: {pathname}}} /></MockNextContext></Provider>;
  wrapper = mount(renderComp);
  return wrapper;
};

describe("ClaimList test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    wrapper.unmount();
  })

  describe("ClaimList renders without error", () => {
    it("should render the ClaimList successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(CLAIM_LIST));
      wrapper = setUp("/claims", mockStore);
      let tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper = setUp("/claims/", mockStore)
      tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
    });
    it("should render without claim summary filter", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      let store = JSON.parse(JSON.stringify(mockStore));
      delete store.dashboard.filter["widget-claim-summary"];
      wrapper = setUp("/claims/", store)
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    })
    it("displays claim details modal", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp("/claims/BPCASE-123", mockStore)
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    })
    it("should trigger claims filter actions", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp("/claims", mockStore)
      wrapper.find(".clear-btn").at(0).simulate("click");
      wrapper.find(".apply-btn").at(0).simulate("click");
    })
    it("should initiate search", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp("/claims", mockStore);
      wrapper.find("#search-box").at(0).simulate("change");
    })
    it("should add filter", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(CLAIM_LIST));
      wrapper = setUp("/claims", mockStore);
      await Promise.resolve();
      wrapper.update();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".form-check-input").at(0).simulate("change", {target: {checked: true}});
    })
    it("tests for scenario when backend sends error", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {errors: ["error"]}}));
      wrapper = setUp("/claims", mockStore);
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    });
  });
});
