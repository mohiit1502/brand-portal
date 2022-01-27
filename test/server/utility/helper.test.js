import Helper from "../../../src/server/utility/helper";


describe("Helper Tests ",() => {

  const setup = () => {
    const mockDate = new Date("2022-01-20T07:46:27.925Z");
    jest.spyOn(global, 'Date')
      .mockImplementation(() => mockDate)
  }

  describe("Get Date Range",() => {

    beforeEach(() => {
      setup();
    })

    afterEach(() => {
      jest.restoreAllMocks();
    })

    it("From to Date",() => {
      const res = Helper.getDateRange("31-to-35");
      expect(res.fromDate).toBe("31");
      expect(res.toDate).toBe("35")
    });

    it("Last Seven days",() => {
      const res = Helper.getDateRange("last7days");
      expect(res.toDate).toBe("2022-01-21")
      expect(res.fromDate).toBe("2022-01-14")
    });

    it("Last 30 days",() => {
      const res = Helper.getDateRange("last30days");
      expect(res.toDate).toBe("2022-01-21")
      expect(res.fromDate).toBe("2021-12-22")
    });

    it("Last 60 days",() => {
      const res = Helper.getDateRange("last60days");
      expect(res.toDate).toBe("2022-01-21")
      expect(res.fromDate).toBe("2021-11-22")
    });

    it("Last 90 days",() => {
      const res = Helper.getDateRange("last90days");
      expect(res.toDate).toBe("2022-01-21")
      expect(res.fromDate).toBe("2021-10-23")
    });

    it("All time",() => {
      const res = Helper.getDateRange("alltime");
      expect(res.toDate).toBe("2022-01-21")
      expect(res.fromDate).toBe("1970-01-01")
    });
  });


});
