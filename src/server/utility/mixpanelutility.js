/* eslint-disable no-console */
const Mixpanel = require("mixpanel");
let  mixpanel;

export default class MixpanelUtils {
    static setToken(token) {
        MixpanelUtils.token = token;
        MixpanelUtils.intializeMixpanel();
    }
    static intializeMixpanel() {
        try {
            mixpanel = Mixpanel.init(MixpanelUtils.token);
        } catch (e) {
            console.log(e);
        }
    }
    static getToken() {
        return MixpanelUtils.token;
    }
    static trackEvent(eventName, payLoad) {
        try {
            if (!MixpanelUtils.getToken()) {
                MixpanelUtils.intializeMixpanel();
            }
            if (!payLoad) {
                payLoad = {};
            }
            if (payLoad) {
                payLoad.IS_SERVER = true;
                payLoad.$email = payLoad.distinct_id;
                payLoad.$user_id = payLoad.distinct_id;
            }
            payLoad ? mixpanel.track(eventName, payLoad) : mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
}
