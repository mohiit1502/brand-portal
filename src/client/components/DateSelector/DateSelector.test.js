/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React from "react";
import DateSelector from "./DateSelector";
import {mount} from "enzyme";
import DatePickerWrapper from "../DatePickerWrapper";
import moment from "moment";
import toJson from "enzyme-to-json";
import PropTypes from "prop-types";
import {testStore} from "../../utility/TestingUtils";

let props;
let store;

const setUp = (props) => {
  store = testStore({
    dashboard: {
      filters:{}
    },
    currentFilters: {},
    modal:{},
    date: new Date(),
    endDate: "",
    endValueDate: "",
    startDate: "",
    startValueDate: ""
  });
  return mount(props ? <DateSelector store={store} {...props}/> : <DateSelector />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});

describe("DateSelector", () => {
   it("renders without error", () => {
     let wrapper;
     beforeEach(() => {
       jest.restoreAllMocks();
       jest.resetAllMocks();
     });

       props = {
          currentFilers:{},
         dispatchCustomDate: ()=>{},
         dispatchFilter: ()=>{},
         initialDate: {},
         meta: {},
         updateChart: ()=>{},
         toggleModal: ()=>{},
         modal:{}
       };
       wrapper = setUp(props);

       const tree = toJson(wrapper);
       expect(tree).toMatchSnapshot();

     });
});
