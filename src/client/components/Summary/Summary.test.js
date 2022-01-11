import React, {useRef} from "react";
import Summary from "./Summary";
import toJson from "enzyme-to-json";
import renderer from "react-test-renderer";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";


let props;
let store;

const setUp = (props) => {
  store = testStore({
    dashboard : {
      filter : {}
    }
  });
  return renderer.create(props ? <Provider store={store}><MockNextContext pathname="/help"><Summary {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><Summary /></MockNextContext></Provider>);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("Summary", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      currentFilters: {},
      data: {},
      dispatchFilter: () => {},
      fetchComplete: true,
      history: {},
      ID: "",
      toggleModal: () => {},
      userProfile: {},
      widget: {
        DETAILS: {
          body: "",
          footer: "",
          header: "",
          templateName: ""
        }
      },
      widgetCommon: {
        widgetClasses:""
      },
      widgetStackItem: {
        header: {
          layoutClasses: ""
        },
        body: {
          layoutClasses: ""
        },
        footer: {
          layoutClasses: "",
          contentClasses: ""
        }
      }
    };
    wrapper = setUp(props);

    const tree = wrapper.toJSON();
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
