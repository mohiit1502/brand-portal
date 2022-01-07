import '@babel/polyfill';
import fetch from "node-fetch";
import Validator from "../../../src/client/utility/validationUtil";
import Http from "../../../src/client/utility/Http";
import {setupFetchThrowStub} from "../../../src/client/utility/TestingUtils";
import dashboardData from "../mocks/dashboardData";
import dummyThis from "../mocks/dummyThis";

jest.mock("node-fetch");

const parentObj = dummyThis;
const caller = {
  props: {
    validators: {
      "validateRequired": {
        "error": "required error"
      },
      "validateLength": {
        "minLength": 7,
        "maxLength": 7,
        "error": "length error"
      },
      "validateRegex": {
        "dataRuleRegex": "^[a-zA-Z0-9\\- .]+$",
        "error": "regex error"
      },
      "validateDate": {
        "error": "date error"
      }
    }
  }
}

const dummyEvent = {
  target: {
    value: "test123"
  },
  preventDefault: jest.fn()
}

describe("validation utils test container", () => {
  it("should validate form field",  () => {
    const callerObj = JSON.parse(JSON.stringify(caller));
    callerObj.setState = jest.fn()
    let response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).not.toBeUndefined();
    dummyEvent.target.value = "";
    response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).toBe("required error");
    dummyEvent.target.value = "test";
    response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).toBe("length error");
    dummyEvent.target.value = "test12%";
    response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).toBe("regex error");
    dummyEvent.target.value = "test123";
    response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).toBe("date error");
    callerObj.props.validators.validateRegex = null;
    dummyEvent.target.value = "06/2020";
    Validator.validate.call(callerObj, dummyEvent, parentObj);
    dummyEvent.target.value = "01/2022";
    response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).toBe("");
    delete callerObj.props.validators.validateDate
    response = Validator.validate.call(callerObj, dummyEvent, parentObj);
    expect(response).toBe("");
    callerObj.props.validators.validateDate = null;
    Validator.validate.call(callerObj, dummyEvent, parentObj);
  });

  it("validates password match functionality", () => {
    parentObj.setState = jest.fn()
    Validator.validatePasswordMatch(dummyEvent.target, {siblingField: "state.form.inputData.password"}, parentObj)
    expect(parentObj.state.form.passwordsDifferent).toBeDefined();
  })

  it("should validate form state", () => {
    const parent = JSON.parse(JSON.stringify(parentObj));
    parent.setState = jest.fn()
    parent.validateUrlItems = () => true
    let response = Validator.validateState.call(parent);
    expect(response).toBe(false);
    parent.state.form.inputData.username.error = "error set";
    parent.state.form.inputData.companyName.error = "error set";
    response = Validator.validateState.call(parent);
    expect(response).toBe(true);
    parent.state.form.inputData.username.error = "";
    parent.state.form.inputData.companyName.error = "";
    parent.state.form.inputData.username.value = "";
    parent.state.form.inputData.claimType.value = "";
    parent.state.form.inputData.urlItems.value = "";
    response = Validator.validateState.call(parent);
    expect(response).toBe(true);
  })

  it("should test for field validity", () => {
    parentObj.setState = jest.fn()
    parentObj.invalid = {};
    Validator.onInvalid.call(parentObj, dummyEvent, "username");
    expect(parentObj.invalid.username).toBeDefined();
    Validator.onInvalid.call(parentObj, dummyEvent, "password");
    expect(parentObj.invalid.password).toBeDefined();
  })

  it("should check brand uniqueness", () => {
    parentObj.setState = (state, callback) => callback && callback();
    let getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {unique: true}}));
    Validator.checkBrandUniqueness.call(parentObj, {brandName: "test-brand"});
    getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {unique: false}}));
    Validator.checkBrandUniqueness.call(parentObj, {brandName: "test-brand"});
    parentObj.props.originalValues.brand.name = "brandName";
    Validator.checkBrandUniqueness.call(parentObj, {brandName: "brandName"});
    parentObj.state.form.inputData.brandName.value = "";
    Validator.checkBrandUniqueness.call(parentObj, {brandName: "brandName"});
    getter.mockRestore();
    parentObj.state.form.inputData.brandName.value = "test";
    parentObj.props.originalValues.brand.name = "brand-Name";
    fetch.mockImplementation(setupFetchThrowStub);
    Validator.checkBrandUniqueness.call(parentObj, {brandName: "test-brand"});
  })

  it("should check trademark validity", () => {
    parentObj.setState = (state, callback) => callback && callback();
    let getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {usptoVerification: "VALID"}}));
    Validator.checkTrademarkValidity.call(parentObj);
    getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {usptoVerification: "INVALID"}}));
    Validator.checkTrademarkValidity.call(parentObj);
    parentObj.state.form.inputData.trademarkNumber.value = "";
    Validator.checkTrademarkValidity.call(parentObj);
    getter.mockRestore();
    parentObj.state.form.inputData.trademarkNumber.value = "test";
    fetch.mockImplementation(setupFetchThrowStub);
    Validator.checkTrademarkValidity.call(parentObj);
  })

  it("should check company name uniqueness", () => {
    parentObj.setState = (state, callback) => callback && callback();
    let getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {unique: false}}));
    Validator.checkCompanyNameAvailability.call(parentObj);
    parentObj.props.originalValues.org.name = "orgName";
    Validator.checkCompanyNameAvailability.call(parentObj);
    parentObj.state.form.inputData.companyName.value = "";
    Validator.checkCompanyNameAvailability.call(parentObj);
    parentObj.props.originalValues.org.name = "";
    Validator.checkCompanyNameAvailability.call(parentObj);
    getter.mockRestore();
    parentObj.state.form.inputData.companyName.value = "test";
    parentObj.props.originalValues.org.name = "org-Name";
    fetch.mockImplementation(setupFetchThrowStub);
    Validator.checkCompanyNameAvailability.call(parentObj);
    getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {unique: true}}));
    Validator.checkCompanyNameAvailability.call(parentObj);

  })

  it("checks email uniqueness", () => {
    parentObj.setState = (state, callback) => callback && callback();
    let getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {uniquenessStatus: "DENY"}}));
    Validator.onEmailChange.call(parentObj);
    getter = jest.spyOn(Http, "get").mockImplementation(() => Promise.resolve({body: {uniquenessStatus: "KRAKEN"}}));
    Validator.onEmailChange.call(parentObj);
    parentObj.state.form.inputData.emailId.value = "";
    Validator.onEmailChange.call(parentObj);
    getter.mockRestore();
    parentObj.state.form.inputData.emailId.value = "test";
    fetch.mockImplementation(setupFetchThrowStub);
    Validator.onEmailChange.call(parentObj);
  })
});
