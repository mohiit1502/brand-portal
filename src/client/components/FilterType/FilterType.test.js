import React, {useRef} from "react";
import FilterType from "./FilterType";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import {testStore} from "../../utility/TestingUtils";


let props;
let store;

const setUp = (props) => {
  store = testStore({});
  return mount(props ? <FilterType {...props} />: <FilterType />);
};

jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});



describe("FilterType", () => {
  let wrapper;
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  it("renders without error", () => {
    props = {
      clearFilterHandler: () => {},
      currentFilters: {},
      filterMap: {},
      filterText: "",
      filters:[
        {
          id: "1",
          name: "Submitted By",
          filterOptions: [{}, {}]
        },
        {
          id: "2",
          name: "Associated Brands",
          filterOptions: [{}, {}]
        },
        {
          id: "3",
          name: "test",
          filterOptions: [{}, {}]
        }
      ]
    };
    wrapper = setUp(props);

    const tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

  });
});
