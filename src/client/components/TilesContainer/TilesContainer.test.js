import React, {useRef} from "react";
import TilesContainer from "./TilesContainer";
import renderer from "react-test-renderer";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";
import PropTypes from "prop-types";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return renderer.create(props ? <Provider store={store}><MockNextContext pathname="/help"><TilesContainer {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><TilesContainer /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("TilesContainer", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      tiles: []
    };
    wrapper = setUp(props);

    const tree = wrapper.toJSON();
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
