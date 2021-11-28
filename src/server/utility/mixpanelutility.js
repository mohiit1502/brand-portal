/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */

const Mixpanel = require("mixpanel");
let  mixpanel;

export default class MixpanelUtils {
    static setToken(token, enableTracking) {
        MixpanelUtils.token = token;
        MixpanelUtils.enableTracking = enableTracking;
        MixpanelUtils.initializeMixpanel();
    }
    static initializeMixpanel() {
        try {
            mixpanel = Mixpanel.init(MixpanelUtils.token);
        } catch (e) {
            console.log(e);
        }
    }
    static getToken() {
        return MixpanelUtils.token;
    }
    static trackEvent(eventName, incomingPayload) {
        let payload = incomingPayload;
        if (MixpanelUtils.enableTracking) {
            try {
                if (!MixpanelUtils.getToken()) {
                    MixpanelUtils.initializeMixpanel();
                }
                payload = payload ? payload : {};
                if (payload) {
                    payload.IS_SERVER = true;
                    if (payload.distinct_id) {
                      payload.$email = payload.distinct_id;
                      payload.$user_id = payload.distinct_id;
                    }
                }
                payload ? mixpanel.track(eventName, payload) : mixpanel.track(eventName);
            } catch (e) {
                console.log(e);
            }
        }
    }
}
