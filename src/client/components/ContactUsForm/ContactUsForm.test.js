import React, {useRef} from "react";
import renderer from "react-test-renderer";
import ContactUsForm from "./ContactUsForm";
import toJson from "enzyme-to-json";
import {configure, shallow} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {testStore} from "../../utility/TestingUtils";
import PropTypes from "prop-types";
import Adapter from "enzyme-adapter-react-16";
import formFieldMeta from "../../config/formsConfig/form-field-meta";

let props;
let store;

configure({adapter: new Adapter()});
const setUp = () => {
  store = testStore({
    content: {
      metadata: formFieldMeta
    }
  });
  return renderer.create(<Provider store={store}><ContactUsForm /></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("ContactUsForm", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {

    wrapper = setUp();
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();

  });
});
