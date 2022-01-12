import classUnderTest from "../../../src/server/plugins/dashboard/dashboard-manager-api";
import Hapi from "hapi";

describe("Dashboard Tests ",() => {

  jest.mock("/secrets/secrets.json", ()=>({
    secrets: 'Test Secrets'
  }), { virtual: true });

  it("Should render",() => {
  })

});
