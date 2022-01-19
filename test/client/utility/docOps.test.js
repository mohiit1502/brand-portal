import DocOps from "../../../src/client/utility/docOps";
import dummyThis from "../mocks/dummyThis"
import Http from "../../../src/client/utility/Http";

describe("docOps util test container", () => {
  let parentObj;
  beforeEach(() => {
    parentObj = JSON.parse(JSON.stringify(dummyThis));
    parentObj.setState = (state, callback) => {
      state && typeof state === "function" && state(parentObj.state);
      callback && callback();
    }
    parentObj.checkToEnableSubmit = jest.fn();
  })
  it("should upload document",  async () => {
    jest.useFakeTimers()

    jest.spyOn(Http, "postAsFormData").mockImplementation(() => Promise.resolve({body:{}}));
    await DocOps.displayProgressAndUpload.call(parentObj, {target: {files: [{name: "test.file", size: "3000000", type: "text/html"}]}}, "businessRegistrationDoc")
    jest.runAllTimers();
    DocOps.displayProgressAndUpload.call(parentObj, {target: {files: [{name: "test.file", size: "8000000", type: "text/html"}]}}, "businessRegistrationDoc")
    DocOps.displayProgressAndUpload.call(parentObj, {}, "businessRegistrationDoc")
    parentObj.props.showNotification = jest.fn()
    parentObj.checkToEnableSubmit = null;
    DocOps.displayProgressAndUpload.call(parentObj, {target: {files: [{name: "test.file", size: "3000000", type: "text/html"}]}}, "businessRegistrationDoc")
    jest.useRealTimers();
  });
  it("should cancel upload document",  () => {
    DocOps.cancelSelection.call(parentObj, "businessRegistrationDoc")
  });
});
