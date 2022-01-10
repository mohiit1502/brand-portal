/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {configure, mount} from "enzyme";
import {clearKeys, testStore} from "../../../../../../src/client/utility/TestingUtils";
import ClaimList from "../../../../../../src/client/components/home/content-renderer/claim/claim-list";
import profile from "../../../../mocks/userProfile";
import Http from "../../../../../../src/client/utility/Http";
import MockNextContext from "../../../../utility/MockNextContext";
import currentFilters from "../../../../mocks/currentFilters";
import Adapter from "enzyme-adapter-react-16";

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
    user: {profile}
  };
  store = testStore(mockStore);
  // ClaimList.prototype.setState = ({}, callback) => callback && callback();
  return mount(<Provider store={store}><MockNextContext pathname="/claims"><ClaimList /></MockNextContext></Provider>);
};

describe("ClaimList test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("ClaimList renders without error", () => {
    it("should render the ClaimList successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
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
