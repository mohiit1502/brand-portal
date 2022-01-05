import ContentRenderer from "../../../src/client/utility/ContentRenderer";

const parentObj = {
  state: {
    isSeller: false,
    form: {
      isDisabled: true,
      inputData: {
        userType: {
          value: "ThirdParty"
        },
        claimType: {
          value: "counterfeit"
        }
      }
    }
  }
}

describe("content renderer util test container", () => {
  let evaluator;
  beforeAll(() => {
    evaluator = ContentRenderer.evaluateRenderDependency.bind(parentObj);
  })
  it("should execute render dependency evaluator for single condition",  () => {
    let response = evaluator("{\"keyPath\": \"state.form.inputData.userType.value\", \"keyLocator\": \"parentRef\", \"value\": \"thirdparty\"}");
    expect(response).toBe(true);
  });
  it("should execute render dependency evaluator for multiple conditions", () => {
    const response = evaluator("[{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": true},{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": false}]");
    expect(response).toBe(true);
  })
  it("should execute render dependency evaluator for multiple blocks of conditions", () => {
    const response = evaluator("[{\"keyPath\": \"form.inputData.userType.value\", \"keyLocator\": \"state\", \"value\": [\"third party\",\"rights owner\"]}, {\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": [\"counterfeit\", \"patent\", \"trademark\"]}]||{\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": \"counterfeit\"}");
    parentObj.state.form.inputData.userType.value = "third party"
    expect(response).toBe(true);
    parentObj.state.form.inputData.claimType.value = "patent"
    expect(response).toBe(true);
  })
});
