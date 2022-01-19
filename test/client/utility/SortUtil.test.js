import SortUtil from "../../../src/client/utility/SortUtil";
import dummyThis from "../mocks/dummyThis";
import {setupFetchThrowStub} from "../../../src/client/utility/TestingUtils";

describe("mixpanel util test container for original lib", () => {
  it("should initialize Mixpanel",  () => {
    jest.spyOn(SortUtil, "multiSortUtil").mockImplementation(setupFetchThrowStub);
    SortUtil.multiSort.call(dummyThis,[], true);
  });

  it("should sort numeric and date values", () => {
    let response = SortUtil.sortNumericAndDate("20", "10", 0);
    expect(response).toBe(10);
    response = SortUtil.sortNumericAndDate("20", "10", 1);
    expect(response).toBe(-10);
    response = SortUtil.sortNumericAndDate("testa", "testb", 2);
    expect(response).toBe(0);
  });

  it("should sort list", () => {
    const columns = {sortState: {level: 0, type: "list"}, accessor: "test"};
    const response = SortUtil.sortList([], columns);
    expect(response).toMatchObject([]);
  });

  it("should return 0 when sorting alphabet when expected input is absent", () => {
    const response = SortUtil.sortAlphabet("", "test", 0);
    expect(response).toBe(0);
  });

  it("should perform case insensitive sort", () => {
    let response = SortUtil.sortAlphabetWithoutCase(5, 10, 0);
    expect(response).toBe(-1);
    response = SortUtil.sortAlphabetWithoutCase(5, 10, 1);
    expect(response).toBe(1);
    response = SortUtil.sortAlphabetWithoutCase(10, 5, 0);
    expect(response).toBe(1);
    response = SortUtil.sortAlphabetWithoutCase(10, 5, 1);
    expect(response).toBe(-1);
  })
});
