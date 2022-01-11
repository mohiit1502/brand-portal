import mixpanel from "mixpanel-browser";
import MixpanelUtils from "../../../src/client/utility/mixpanelutils";
import {setupFetchThrowStub} from "../../../src/client/utility/TestingUtils";
import userProfile from "../mocks/userProfile";

jest.mock("mixpanel-browser");

describe("mixpanel util test container for mocked lib", () => {
  beforeEach(() => {
    mixpanel.track.mockImplementation(jest.fn());
    mixpanel.alias.mockImplementation(setupFetchThrowStub);
  })
  it("should not initialize Mixpanel on error", () => {
    mixpanel.init.mockImplementation(setupFetchThrowStub);
    MixpanelUtils.initializeMixpanel("1968bbc8bf2304c4c850ca1d53e79ea2", true);
    expect(MixpanelUtils.enableTracking).toBeUndefined();

    MixpanelUtils.enableTracking = true;
    MixpanelUtils.login("test", "");
    mixpanel.register.mockImplementation(setupFetchThrowStub);
    MixpanelUtils.setUserProperty(userProfile);
    jest.spyOn(MixpanelUtils, "setSuperProperties").mockImplementation(setupFetchThrowStub);
    MixpanelUtils.setUserProperty(userProfile);
    mixpanel.reset.mockImplementation(setupFetchThrowStub);
    MixpanelUtils.clearCookies(userProfile);
    jest.spyOn(MixpanelUtils, "clearCookies").mockImplementation(setupFetchThrowStub);
    MixpanelUtils.logout();
    mixpanel.track.mockImplementation(setupFetchThrowStub);
    MixpanelUtils.login("test", "");
    jest.spyOn(MixpanelUtils, "setAlias").mockImplementation(setupFetchThrowStub);
    MixpanelUtils.login("test", "");
  });

  it("should populates profile", () => {
    const response = MixpanelUtils.populateProfileInfo(userProfile);
    expect(response.IS_ORG_ENABLED).toBe(userProfile.isOrgEnabled);
  });
});
