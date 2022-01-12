import React, {useRef} from "react";
import renderer from "react-test-renderer";
import HelpMain from "./HelpMain";
import toJson from "enzyme-to-json";
import {shallow} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return shallow(props ? <Provider store={store}><MockNextContext pathname="/help"><HelpMain {...props} /> </MockNextContext></Provider>: <HelpMain />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("HelpMain", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      activeTab:"1",
      content: {
        "1":{
          id:""
        }
      },
      goToContactUs: () => {}
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
