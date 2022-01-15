import SearchUtil from "../../../src/client/utility/SearchUtil";

jest.mock("node-fetch");
describe("SearchUtil util test container",  () => {
  it("should return filtered list on search", () => {
    const dummyList = [{}, {}]
    const response = SearchUtil.getFilteredList(dummyList, "test", "default");
    expect(response).toMatchObject(dummyList);
  });
});
