import FilterUtil from "../../../src/client/utility/FilterUtil";

jest.mock("node-fetch");
describe("FilterUtil test container",  () => {
  it("should apply passed filter", () => {
    const filter = {id: "brands", filterOptions: [{selected: true, value: "test"}]};
    const filteredList = [{brands: ["brand-name-test"]}]
    FilterUtil.applyFiltersUtil(filter, filteredList);
  });
});
