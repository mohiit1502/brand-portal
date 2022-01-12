import classUnderTest from "../../../src/server/plugins/dashboard/dashboard-manager-api";
import Hapi from "hapi";
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ServerUtils from "../../../src/server/utility/server-utils";
import headerResponse from "../mocks/headers-response.json";
import mixpanel from "../../../src/server/utility/mixpanelutility";

configure({ adapter: new Adapter() });

let server;
let getHeadersMethod;
let ccmGetMethod;
let serverHttpMethod;
let mixPanelTrackEventMethod

jest.mock("/secrets/secrets.json", ()=>({
  secrets: 'Test Secrets'
}), { virtual: true });

const setUp = () => {
  server = new Hapi.Server();
  getHeadersMethod = jest.spyOn(ServerUtils,"getHeaders")
    .mockResolvedValueOnce(headerResponse);
  ccmGetMethod = jest.spyOn(ServerUtils,"ccmGet")
    .mockResolvedValueOnce("https://test.com")
    .mockResolvedValueOnce("/test");
  mixPanelTrackEventMethod = jest.spyOn(mixpanel,"trackEvent").mockImplementationOnce(() => {
    console.log("This is mock mixpanel implementation");
  });
  server.register(classUnderTest);
};

describe("Dashboard Tests ",() => {

  it("Should render",() => {
  })

});
