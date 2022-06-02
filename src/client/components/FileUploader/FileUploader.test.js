// /* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
// import React from "react";
// import {mount} from "enzyme";
// import FileUploader from "../FileUploader";
// import {Provider} from "react-redux";
// import toJson from "enzyme-to-json";
// import {testStore} from "../../utility/TestingUtils";
//
// let props;
// let store;
//
// const setUp = (props) => {
//   store = testStore({});
//   return mount(props ?  <Provider store={store} ><FileUploader {...props}/></Provider> : <Provider store={store} ><FileUploader /></Provider>);
// };
//
// jest.mock("react", () => {
//   const originReact = jest.requireActual("react");
//   const mUseRef = jest.fn();
//   return {
//     ...originReact,
//     useRef: mUseRef
//   };
// });
//
// describe("FileUploader", () => {
//   it("renders without error", () => {
//     let wrapper;
//     beforeEach(() => {
//       jest.restoreAllMocks();
//       jest.resetAllMocks();
//     });
//
//     props = {
//       buttonText: "",
//       cancelHandlerArg: "",
//       containerClasses: "",
//       disabled: true,
//       filename: "",
//       icon: "",
//       id: "",
//       label: "",
//       onCancel: () => {},
//       onChange: () => {},
//       parentRef: {},
//       setTooltipContent: () => {},
//       tooltipContentKey: "",
//       uploading: true,
//       uploadPercentage: 111
//     };
//     wrapper = setUp(props);
//
//     const tree = toJson(wrapper);
//     expect(tree).toMatchSnapshot();
//
//   });
// });
