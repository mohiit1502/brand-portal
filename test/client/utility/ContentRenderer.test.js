import ContentRenderer from "../../../src/client/utility/ContentRenderer";

import dummyThis from "../mocks/dummyThis";
import dummyContent from "../mocks/dummyContent";

expect.extend({
  toBeBoolean(received) {
    return received === true || received === false ? {
      message: () => `received ${received} as expected`,
      pass: true
    } : {
      message: () => `expected ${received} to be boolean`,
      pass: false
    };
  }
});

describe("content renderer util test container", () => {
  let evaluator;
  let parentObj;
  beforeEach(() => {
    parentObj = JSON.parse(JSON.stringify(dummyThis));

    evaluator = ContentRenderer.evaluateRenderDependency.bind(parentObj);
  })
  it("should execute render dependency evaluator for single condition",  () => {
    let response = evaluator("{\"keyPath\": \"state.form.inputData.userType.value\", \"keyLocator\": \"parentRef\", \"value\": \"thirdparty\"}");
    expect(response).toBe(true);
  });
  it("should execute render dependency evaluator for multiple conditions", () => {
    const response = evaluator("[{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": true},{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": false}]");
    expect(response).toBe(true);
  });

  it("should execute render dependency evaluator for multiple blocks of conditions", () => {
    const response = evaluator("[{\"keyPath\": \"form.inputData.userType.value\", \"keyLocator\": \"state\", \"value\": [\"third party\",\"rights owner\"]}, {\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": [\"counterfeit\", \"patent\", \"trademark\"]}]||{\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": \"counterfeit\"}");
    parentObj.state.form.inputData.userType.value = "third party"
    expect(response).toBe(true);
    parentObj.state.form.inputData.claimType.value = "patent"
    expect(response).toBe(true);

  });
  it("should evaluate render condition", () => {
    parentObj.state.form.inputData.brandName.required = {"default": false, "condition":
        [{"keyPath": "form.inputData.userType.value", "keyLocator": "state", "dependencyValue": ["ThirdParty","RightsOwner"]}]}
    let response = ContentRenderer.hookConditionInterceptor.call(parentObj, parentObj.state.form.inputData.brandName, ["required"]);
    expect(response.required).toBeBoolean();
    parentObj.state.form.inputData.brandName.required = {"default": false, "condition":
        [{subCondition: [
          {"keyPath": "form.inputData.userType.value", "keyLocator": "state", "dependencyValue": ["ThirdParty","RightsOwner"]},
          {"keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": ["counterfeit","patent"]}
        ], value: true}]}
    response = ContentRenderer.hookConditionInterceptor.call(parentObj, parentObj.state.form.inputData.brandName, ["required"]);
    expect(response.required).toBeBoolean();
    parentObj.state.form.inputData.brandName.validators = {
      "validateLength": {
        "evaluator": {
          "default": 30, "condition": [
            {
              "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "counterfeit",
              "setFields": [{"field": "maxLength", "value": 13}, {
                "field": "error",
                "value": "Please enter valid order number"
              }]
            }
          ]
        }
      }
    }
    response = ContentRenderer.hookConditionInterceptor.call(parentObj, parentObj.state.form.inputData.brandName, ["validators"]);
    expect(response.validators.validateLength.maxLength).toBe(13);
    parentObj.state.form.inputData.claimType.value = "patent";
    parentObj.state.form.inputData.brandName.validators = {
      "validateLength": {
        "evaluator": {
          "default": 30, "condition": [
            [{
              "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "counterfeit",
              "setFields": [{"field": "maxLength", "value": 13}, {
                "field": "error",
                "value": "Please enter valid order number"
              }]
            }]
          ]
        }
      }
    }
    response = ContentRenderer.hookConditionInterceptor.call(parentObj, parentObj.state.form.inputData.brandName, ["validators"]);
    expect(response.validators.validateLength.maxLength).toBeUndefined();
  });

  it("should return requested data source in component", () => {
    let response = ContentRenderer.getValueLocator.call(parentObj, "CONSTANTS");
    expect(response.ROUTES).toBeDefined();
    response = ContentRenderer.getValueLocator.call(parentObj, "state");
    expect(response).toBe(parentObj.state);
    response = ContentRenderer.getValueLocator.call(parentObj, "props");
    expect(response).toBe(parentObj.props);
    response = ContentRenderer.getValueLocator.call(parentObj, "parentRef");
    expect(response).toBe(parentObj);
  });

  it("should render a form", () => {
    const response = ContentRenderer.getFieldRenders.call(parentObj);
    expect(response).toBeDefined();
    parentObj.state.form.excludeRowContainer = true;
    parentObj.state.form.conditionalRenders = {companyName: {complyingFields: ["claimType"], condition: {flag: "claimType", locator: "form"}}};
    parentObj.onChange = jest.fn();
    parentObj.onInvalid = jest.fn();
    parentObj.onKeyPress = jest.fn();
    ContentRenderer.getFieldRenders.call(parentObj);
    delete parentObj.state;
    ContentRenderer.getFieldRenders.call(parentObj);
  });

  it("should return content DOM", () => {
    const renderer = new ContentRenderer();
    let response = Object.keys(dummyContent.content).map(node => {
      return renderer.getContent(dummyContent.content, node);
    });
    expect(response.length).toBe(Object.keys(dummyContent.content).length);
  })
});
