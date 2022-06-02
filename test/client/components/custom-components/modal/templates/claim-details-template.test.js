// /* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
// import React from "react";
// import {Provider} from "react-redux";
// import {BrowserRouter} from "react-router-dom";
// import renderer from "react-test-renderer";
// import Cookies from "electrode-cookies";
// import {testStore} from "../../../../../../src/client/utility/TestingUtils";
// import ClaimDetailsTemplate from "../../../../../../src/client/components/custom-components/modal/templates/claim-details-template";
// import profile from "../../../../mocks/userProfile";
// import Http from "../../../../../../src/client/utility/Http";
// import MODALSMETA from "../../../../../../src/client/config/contentDescriptors/modals-meta";
// import FORMFIELDMETA from "../../../../../../src/client/config/formsConfig/form-field-meta";
// import {mount} from "enzyme";
//
// let store;
// jest.mock("electrode-cookies");
//
// const setUpRender = () => {
//   const mockStore = {
//     content: {
//       metadata: {...MODALSMETA, ...FORMFIELDMETA},
//     },
//     user: {profile}
//   };
//   const data = {
//     firstName: "test-fname",
//     lastName: "test-lname",
//     type: "test-counterfeit",
//     items: [{}]
//   }
//   store = testStore(mockStore);
//   return renderer.create(<Provider store={store}><ClaimDetailsTemplate data={data}/></Provider>);
// };
//
// describe("ClaimDetailsTemplate test container", () => {
//   let wrapper;
//   beforeEach(() => {
//     jest.restoreAllMocks();
//     jest.resetAllMocks();
//     Cookies.get.mockImplementation(jest.fn());
//   });
//
//   it("should render the ClaimDetailsTemplate successfully", () => {
//     wrapper = setUpRender();
//     wrapper.root.findByProps({ className: "close text-white" }).props.onClick();
//     wrapper.root.findByProps({ className: "btn btn-sm btn-primary submit-btn px-3 mx-3" }).props.onClick();
//     wrapper = renderer.create(<Provider store={store}><ClaimDetailsTemplate /></Provider>);
//     expect(wrapper.toJSON()).toMatchSnapshot();
//   });
// });
