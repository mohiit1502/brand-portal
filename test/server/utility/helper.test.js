import classUnderTest from "../../../src/server/utility/helper";

import Hapi from "hapi";

describe("Helper Tests ",() => {

  it("Should render",() => {
    classUnderTest.arrayToObj(["100","20"]);
    expect(true).toBe(true)
  })

});
