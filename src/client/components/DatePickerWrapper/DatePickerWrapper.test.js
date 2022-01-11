/* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
import React, {useRef} from "react";
import DatePickerWrapper from "./DatePickerWrapper";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import moment from "moment";

let props;

const setUp = (props) => {
  return mount(props ? <DatePickerWrapper {...props} /> : <DatePickerWrapper />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("DatePickerWrapper", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
   it("renders without error", () => {
     props = {
      date: moment("2022-01-10"),
      endDate:{},
      focusedLabel:"",
      id:"",
      isOutsideRange: true,
      label:"",
      setDate: ()=>{},
      startDate:{}
    };
     wrapper = setUp(props);

     const tree = toJson(wrapper);
     // expect(tree).toMatchSnapshot();

     wrapper.find("SingleDatePicker").prop("onDateChange")();
     wrapper.update();

     wrapper.find("SingleDatePicker").prop("onFocusChange")("test");
     wrapper.update();

   });
});
