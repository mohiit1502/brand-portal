import React from "react";
import {Provider} from "react-redux";
import toJson from "enzyme-to-json";
import {BrowserRouter} from "react-router-dom";
import Cookies from "electrode-cookies";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Authenticator from "../../../src/client/components/authenticator";
import Http from "../../../src/client/utility/Http";
import {setupFetchStub, testStore} from "../../../src/client/utility/TestingUtils";
import profile from "../mocks/userProfile";
import modalsMeta from "../../../src/client/config/modals-meta";

configure({ adapter: new Adapter() });
jest.mock("electrode-cookies");

const setUp = () => {
  const mockStore = {
    company: {isNew: true},
    content: {metadata: modalsMeta},
    user: {profile}
  };
  const props = {
    location: {pathname: "/dashboard"}
  }
  return mount(<Provider store={testStore(mockStore)}>
      <BrowserRouter>
          <Authenticator {...props} />
      </BrowserRouter>
    </Provider>);
};

describe("Tests for redirection logic in Authenticator", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it("renders authenticator without error", () => {
    Cookies.get.mockImplementation(() => "test-cookie");
    let getter = jest.spyOn(Http, "get").mockImplementation(url => {
      switch (url) {
        case '/api/claims':
          return Promise.resolve({
            body: {
              content: [
                {
                  firstName: "test-f-name",
                  lastName: "test-l-name",
                  email: "abc@gmail.com",
                  brands: [],
                  status: "ACTIVE",
                  role: {name: "test-role"},
                  type: "thirdparty"
                }
              ]
            }
          })
        case '/api/brands':
        case '/api/users':
          return Promise.resolve({
            body: {
              content: [
                {
                  firstName: "test-f-name",
                  lastName: "test-l-name",
                  email: "abc@gmail.com",
                  brands: [],
                  status: "ACTIVE",
                  role: {name: "test-role"},
                  type: "thirdparty"
                }
              ]
            }
          })
        default:
          return Promise.resolve({body: "{}"});
      }
    });
    global.fetch = jest.fn().mockImplementation(setupFetchStub({}));
    wrapper = setUp();
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
    global.fetch.mockClear();
  });


});
