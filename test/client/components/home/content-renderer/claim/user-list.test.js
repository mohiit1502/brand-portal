/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {configure, mount} from "enzyme";
import Immutable from "immutable";
import Cookies from "electrode-cookies";
import {
  clearKeys,
  realStore,
  setupFetchStub,
  setupFetchThrowStub
} from "../../../../../../src/client/utility/TestingUtils";
import UserList from "../../../../../../src/client/components/home/content-renderer/user/user-list";
import profile from "../../../../mocks/userProfile";
import Http from "../../../../../../src/client/utility/Http";
import MockNextContext from "../../../../utility/MockNextContext";
import currentFilters from "../../../../mocks/currentFilters";
import Adapter from "enzyme-adapter-react-16";
import USER_LIST from "../../../../mocks/user-list.dummy";

jest.mock("electrode-cookies");
configure({ adapter: new Adapter() });
let store;
let wrapper;

const mockStore = {
  dashboard: {
    filter: currentFilters,
    widgetAction: "widget-user-summary"
  },
  modal: {},
  user: {profile},
  userEdit: Immutable.Map({
    userList: [],
    save: true
  })
};

const userRowData = {
  original: {
    "id": "wm.ropro.stg@mailinator.com",
    "loginId": "wm.ropro.stg@mailinator.com",
    "username": "Mohit Nagar",
    "sequence": 1,
    "brands": [
      "Test-brand-833",
      "alsjfdlasdk",
      "blsjfdlakajhs"
    ],
    "dateAdded": "01-10-2022",
    "status": "Active",
    "original": {
      "firstName": "Mohit",
      "lastName": "Nagar",
      "phoneCountry": "1",
      "phoneNumber": "5866666666",
      "emailVerified": true,
      "isUserEnabled": true,
      "organization": {
        "id": "94ba054-9ef1-4df1-8286-05017a7d8fe2",
        "name": "Apple In USPTO 223",
        "status": "Accepted",
        "statusDetails": "null",
        "isOrgEnabled": true
      },
      "role": {
        "name": "Super Admin"
      },
      "brands": [
        {
          "id": "294ba054-9ef1-4df1-8286-05017a7d8fe2",
          "name": "Test-brand-833",
          "status": "Verified"
        },
        {
          "id": "ed6ffdc2-eca9-4ead-9290-46106ef03559",
          "name": "alsjfdlasdk",
          "status": "Pending Verification",
          "statusDetails": "null"
        },
        {
          "id": "d5e752ea-8d0c-46a0-8615-1b5a9d95239e",
          "name": "blsjfdlakajhs",
          "status": "Pending Verification",
          "statusDetails": "null"
        }
      ],
      "type": "Internal",
      "registrationMode": "SelfRegistered",
      "email": "wm.ropro.stg@mailinator.com",
      "status": "Active",
      "statusDetails": "self registered",
      "createdBy": "wm.ropro.stg@mailinator.com",
      "createTs": "2022-01-10T17:49:35.080Z",
      "source": "KRAKEN",
      "lastUpdatedBy": "wm.ropro.stg@mailinator.com",
      "lastUpdateTs": "2022-01-10T18:01:04.507Z",
      "isSellerInfoUSPresent": false,
      "isOrgEnabled": true,
      "workflow": {
        "code": 4,
        "workflow": "portal_dashboard",
        "defaultView": "portal-view-users",
        "roleCode": 1,
        "roleView": "SUPER_ADMIN"
      }
    },
    "role": "Super Admin"
  }
};

const setUp = (pathname) => {
  store = realStore(mockStore);
  wrapper = mount(<Provider store={store}><MockNextContext><UserList history={{location: {pathname}}} /></MockNextContext></Provider>);
  return wrapper;
};

describe("UserList test container", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    wrapper.unmount();
  })

  describe("UserList renders without error",  () => {
    it("should render the UserList successfully", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(USER_LIST));
      wrapper = setUp();
      await Promise.resolve();
      wrapper.update();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
      wrapper.find(".table-row > .table-head-cell").at(1).simulate("click");
      jest.spyOn(Http, "get").mockImplementation((url, params, callback) => {
        callback && callback();
        return Promise.resolve(USER_LIST);
      });
      setUp("/users/", store);
    });
    it("should trigger user filter actions", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(USER_LIST));
      wrapper = setUp("/users");
      await Promise.resolve();
      await wrapper.instance().forceUpdate();
      wrapper.update();
      wrapper.find(".clear-btn").at(0).simulate("click");
      wrapper.find(".apply-btn").at(0).simulate("click");
      wrapper.find("FilterType").props().clearFilter("username", 1);
    });
    it("should trigger user ellipsis actions", async () => {
      Cookies.get.mockImplementation(() => "test-cookie");
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(USER_LIST));
      jest.spyOn(Http, "put").mockImplementation((url, payload, params, callback) => {
        callback && callback();
        return Promise.resolve(USER_LIST)
      });
      jest.spyOn(Http, "post").mockImplementation((url, payload, params, callback) => {
        callback && callback();
        return Promise.resolve(USER_LIST)
      });
      wrapper = setUp("/users");
      await Promise.resolve();
      await wrapper.instance().forceUpdate();
      wrapper.update();
      const ddProps = wrapper.find("CustomTable").props();
      ddProps.templateProps.dropdownOptions.dropdownOptions[0].clickCallback({}, "", userRowData);
      ddProps.templateProps.dropdownOptions.dropdownOptions[1].clickCallback({}, "", userRowData);
      ddProps.templateProps.dropdownOptions.dropdownOptions[2].clickCallback({}, "", userRowData);
      jest.spyOn(Http, "post").mockImplementation(() => Promise.resolve({body: true}));
      ddProps.templateProps.dropdownOptions.dropdownOptions[2].clickCallback({}, "", userRowData);
      let spy = jest.spyOn(Http, "post").mockImplementation(() => Promise.resolve({body: false, status: 200}));
      ddProps.templateProps.dropdownOptions.dropdownOptions[2].clickCallback({}, "", userRowData);
      spy.mockRestore();
      global.fetch = jest.fn().mockImplementation(setupFetchThrowStub);
      ddProps.templateProps.dropdownOptions.dropdownOptions[2].clickCallback({}, "", userRowData);
      global.fetch.mockClear();
    });
    it("should initiate search", () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {}}));
      wrapper = setUp()
      wrapper.find("#search-box").at(0).simulate("change");
    })
    it("should add filter", async () => {
      jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve(USER_LIST));
      wrapper = setUp("/user");
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
      wrapper = setUp();
      const tree = toJson(wrapper);
      clearKeys(tree, []);
      expect(tree).toMatchSnapshot();
    });
  });
});
