// /* eslint-disable filenames/match-regex, no-unused-vars, no-undef */
// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import React from "react";
// import {Provider} from "react-redux";
// import {BrowserRouter} from "react-router-dom";
// import renderer from "react-test-renderer";
// import Cookies from "electrode-cookies";
// import {mockFetch, testStore, update} from "../../../../../src/client/utility/TestingUtils";
// import {mount} from "enzyme";
// import CompanyProfileRegistration from "../../../../../src/client/components/onboard/content-renderer-onboarding/company-profile-registration";
// import profile from "../../../mocks/userProfile";
// import MODALSMETA from "../../../../../src/client/config/contentDescriptors/modals-meta";
// import FORMFIELDMETA from "../../../../../src/client/config/formsConfig/form-field-meta";
// import applicationDetails from "../../../mocks/applicationDetails";
//
// let store;
// jest.mock("electrode-cookies");
//
// const setUpRender = () => {
//   const mockStore = {
//     content: {
//       metadata: {...MODALSMETA, ...FORMFIELDMETA},
//     },
//     company: {onboardingDetails: applicationDetails},
//     user: {profile}
//   };
//   store = testStore(mockStore);
//   return renderer.create(<Provider store={store}><CompanyProfileRegistration /></Provider>);
// };
//
// const setUpMount = (isEditContext) => {
//   profile.context = isEditContext ? "edit" : "new";
//   const mockStore = {
//     content: {
//       metadata: {...MODALSMETA, ...FORMFIELDMETA},
//     },
//     company: {onboardingDetails: applicationDetails},
//     user: {profile}
//   };
//   store = testStore(mockStore);
//   return mount(<Provider store={store}><BrowserRouter><CompanyProfileRegistration /></BrowserRouter></Provider>);
// };
//
// describe("CompanyProfileRegistration test container", () => {
//   let wrapper;
//   beforeEach(() => {
//     jest.restoreAllMocks();
//     jest.resetAllMocks();
//     Cookies.get.mockImplementation(jest.fn());
//   });
//
//   it("should render the CompanyProfileRegistration successfully", () => {
//     wrapper = setUpRender();
//     expect(wrapper.toJSON()).toMatchSnapshot();
//   });
//
//   it("should trigger input change events and actions for edit context", async () => {
//     jest.useFakeTimers();
//     const companyName = "test-company";
//     const clientType = "seller";
//     mockFetch({
//       data: {
//         shouldMap: true,
//         [`/api/company/availability?companyName=${companyName}&clientType=${clientType}`]: {unique: true, name: companyName}
//       }
//     });
//     wrapper = setUpMount(true);
//     await update(wrapper);
//     wrapper.find(".form-control-companyName").at(0).simulate('change', {target: {value: companyName}});
//     // wrapper.find(".dropdown-item").at(0).simulate('click');
//     // wrapper.find("div.btn.btn-sm.btn-block.btn-primary").at(0).simulate('click');
//     // wrapper.find("button.btn.btn-sm.btn-block.cancel-btn.text-primary").at(0).simulate('click');
//     // wrapper.find(".form-control-comments").at(0).simulate('change', {target: {value: "comment-12345432-comment"}});
//     jest.runAllTimers();
//     jest.useRealTimers();
//   });
//
//   it("should trigger input change events and actions for new context", async () => {
//     jest.useFakeTimers();
//     const companyName = "test-company";
//     const clientType = "seller";
//     mockFetch({
//       data: {
//         shouldMap: true,
//         [`/api/company/availability?companyName=${companyName}&clientType=${clientType}`]: {unique: true, name: companyName}
//       }
//     });
//     wrapper = setUpMount(false);
//     await update(wrapper);
//     wrapper.find(".form-control-companyName").at(0).simulate('change', {target: {value: companyName}});
//     // wrapper.find("div.btn.btn-sm.btn-block.btn-primary").at(0).simulate('click');
//     // wrapper.find("button.btn.btn-sm.btn-block.cancel-btn.text-primary").at(0).simulate('click');
//     // wrapper.find(".form-control-comments").at(0).simulate('change', {target: {value: "comment-12345432-comment"}});
//     jest.runAllTimers();
//     jest.useRealTimers();
//   });
// });
