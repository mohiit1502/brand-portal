import classUnderTest from "../../../src/server/plugins/dashboard/dashboard-manager-api";
import Hapi from "hapi";

describe("Dashboard Tests ",() => {

  it("Should render",() => {
    const server = new Hapi.Server();;
    server.inject({});
  })

});
