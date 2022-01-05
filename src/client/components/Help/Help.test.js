/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import {Provider} from "react-redux";
import renderer from "react-test-renderer";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import Help from "./";
import helpData from "../../../../test/client/mocks/helpData";
import Http from "../../utility/Http";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJson from "enzyme-to-json";
import formFieldMeta from "../../../../src/client/config/formsConfig/form-field-meta";
import MockNextContext from "../../../../test/client/utility/MockNextContext";

let store;
Enzyme.configure({adapter: new Adapter()});

const setUp = (pathname) => {
  store = testStore({
    content: {
      viewerState: {
        show: true
      },
      metadata: formFieldMeta
    }
  });
  return mount(<Provider store={store}>
    <MockNextContext pathname={pathname}>
      <Help />
    </MockNextContext>
  </Provider>);
};

describe("Help", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("should render help successfully", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: helpData}));
    const wrapper = setUp("/help");
    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();
  });

  it("should render contact us section in help", () => {
    jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: helpData}));
    const wrapper = setUp("/help/contact");
    const tree = toJson(wrapper);
    clearKeys(tree, []);
    // expect(tree).toMatchSnapshot();
  })
});
