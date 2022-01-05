import Helper from "../../../src/client/utility/Helper";

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

describe("helper util test container", () => {
  it("should convert string to camel case with first letter uppercase",  () => {
    let response = Helper.toCamelCaseFirstUpper("abc-def");
    expect(response).toBe("AbcDef");
    response = Helper.toCamelCaseFirstUpper();
    expect(response).toBe("");
    response = Helper.toCamelCaseFirstUpper("abcdef");
    expect(response).toBe("Abcdef");
  });

  it("should convert string to camel case", () => {
    let response = Helper.toCamelCaseFirstUpper();
    expect(response).toBe("");
    response = Helper.toCamelCase("abc-def");
    expect(response).toBe("abcdef");
  })

  it("searches for dot separated path in object", () => {
    const response = Helper.search("CODES.ERRORCODES.FORBIDDEN");
    expect(response).toBe("403");
  })
  // it("should execute render dependency evaluator for multiple blocks of conditions", () => {
  //   const response = evaluator("[{\"keyPath\": \"form.inputData.userType.value\", \"keyLocator\": \"state\", \"value\": [\"third party\",\"rights owner\"]}, {\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": [\"counterfeit\", \"patent\", \"trademark\"]}]||{\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": \"counterfeit\"}");
  //   parentObj.state.form.inputData.userType.value = "third party"
  //   expect(response).toBe(true);
  //   parentObj.state.form.inputData.claimType.value = "patent"
  //   expect(response).toBe(true);
  // })
});
