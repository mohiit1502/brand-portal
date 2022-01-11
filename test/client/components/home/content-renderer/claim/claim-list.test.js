/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {configure, mount} from "enzyme";
import {clearKeys, realStore} from "../../../../../../src/client/utility/TestingUtils";
import reducer from "../../../../../../src/client/reducers/claim/claim-reducers";
import ClaimList from "../../../../../../src/client/components/home/content-renderer/claim/claim-list";
import profile from "../../../../mocks/userProfile";
import Http from "../../../../../../src/client/utility/Http";
import currentFilters from "../../../../mocks/currentFilters";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
let store;

const setUp = (pathname) => {
  const mockStore = {
    dashboard: {
      filter: currentFilters,
      widgetAction: "test-widget-action"
    },
    claims: {
      claimList: [],
      fetchClaimsCompleted: true
    },
    modal: {},
    user: {profile}
  };
  store = realStore(mockStore);

  return mount(<Provider store={store}><ClaimList history={{location: {pathname}}} /></Provider>);
};

describe("ClaimList test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("ClaimList renders without error", () => {
    it("should render the ClaimList successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {data: {content: [{firstName: "test", lastName: "test"}, {}]}}}));
      wrapper = setUp("/claims");
      let tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      // wrapper = setUp("/claims/")
      // tree = toJson(wrapper);
      // clearKeys(tree, []);
      // expect(tree).toMatchSnapshot();
      // wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
    });
    it("displays claim details modal", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp("/claims/BPCASE-123")
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    })
    it("tests for scenario when backend sends error", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {errors: ["error"]}}));
      wrapper = setUp();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    });
  });
});
