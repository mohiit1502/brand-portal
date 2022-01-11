import MixpanelUtils from "../../../src/client/utility/mixpanelutils";
import userProfile from "../mocks/userProfile";

describe("mixpanel util test container for original lib", () => {
  it("should initialize Mixpanel",  () => {
    MixpanelUtils.initializeMixpanel("1968bbc8bf2304c4c850ca1d53e79ea2", true);
    expect(MixpanelUtils.enableTracking).toBe(true);
    let token = MixpanelUtils.getToken();
    expect(token).toBe("1968bbc8bf2304c4c850ca1d53e79ea2");
    MixpanelUtils.enableTracking = false;
    token = MixpanelUtils.getToken();
    expect(token).toBe("");
  });

  it("should track batch event", async () => {
    MixpanelUtils.initializeMixpanel("1968bbc8bf2304c4c850ca1d53e79ea2", true);
    MixpanelUtils.setUserProperty(userProfile);
    global.fetch = jest.fn().mockImplementation(jest.fn())
    await MixpanelUtils.trackEventBatch("test", [{a: "a"}, {b: "b"}]);
    global.fetch.mockClear()
  })
});
