/* eslint-disable no-console */
const Mixpanel = require("mixpanel");
let  mixpanel;

export default class MixpanelUtils {
    static intializeMixpanel() {
        try {
            mixpanel = Mixpanel.init("1968bbc8bf2304c4c850ca1d53e79ea2");
            //console.log("[WBP] Mixpanel event logging: project token", mixpanel.token);
        } catch (e) {
            console.log(e);
        }
    }
    static getToken() {
        try {
            const token = mixpanel.token;
            //console.log("[WBP] Mixpanel event logging: project token", token);
            return token;
        } catch (e) {
            console.log("[WBP]", e);
            return undefined;
        }
    }
    static trackEvent(eventName, payLoad) {
        try {
            if (!MixpanelUtils.getToken()) {
                MixpanelUtils.intializeMixpanel();
            }
            if (payLoad) {
                payLoad.IS_SERVER = true;
            }
            //console.log("[WBP] Mixpanel event logging: ", eventName, payLoad);
            payLoad ? mixpanel.track(eventName, payLoad) : mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
}
