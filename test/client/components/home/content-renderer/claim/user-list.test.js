/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {configure, mount} from "enzyme";
import Immutable from "immutable";
import {clearKeys, realStore} from "../../../../../../src/client/utility/TestingUtils";
import UserList from "../../../../../../src/client/components/home/content-renderer/user/user-list";
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
    user: {profile},
    userEdit: Immutable.Map({
      userList: [{}, {}]
    })
  };
  store = realStore(mockStore);
  // ClaimList.prototype.setState = ({}, callback) => callback && callback();
  return mount(<Provider store={store}><MockNextContext pathname="/users"><UserList /></MockNextContext></Provider>);
};

describe("UserList test container", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("UserList renders without error", () => {
    it("should render the UserList successfully", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
    });
    it("should reset the filters", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp()
      wrapper.find(".clear-btn").at(0).simulate("click");
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
