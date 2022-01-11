/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import ChartsContainer from "./ChartsContainer";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import MockNextContext from "../../../../test/client/utility/MockNextContext";
import {clearKeys, testStore} from "../../utility/TestingUtils";

let props;
let store;

const setUp = (props) => {
  store = testStore({
    dashboard:{
      customDate:{}
    }
  });
  return mount(props ? <Provider store={store}><MockNextContext pathname="/dashboard"><ChartsContainer {...props} /></MockNextContext></Provider> : <Provider store={store}><MockNextContext><ChartsContainer /></MockNextContext></Provider>);};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});


describe("ChartsContainer", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      API: "",
      currentFilters: {},
      data: [],
      DATAKEY: "",
      fetchComplete: true,
      ID: "",
      SUBTYPE: "",
      userProfile: {},
      widget: {
        DETAILS: {
          chart:{},
          legend:{},
          header:{},
          filters:[]
        }
      },
      widgetCommon: {
        widgetClasses:""
      },
      widgetStackItem: {
        header:{
          layoutClasses:""
        },
        body:{
          layoutClasses:"",
          legend:{}
        }
      }
    };
    wrapper = setUp(props);
    const tree = toJson(wrapper);
    clearKeys(tree, []);
    expect(tree).toMatchSnapshot();

  });
});
