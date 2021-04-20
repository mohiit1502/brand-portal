/* eslint-disable no-console */
import {CONSTANTS} from "../constants/server-constants";
const Mixpanel = require("mixpanel");
let  mixpanel;

export default class MixpanelUtils {
    static intializeMixpanel() {
        try {
            mixpanel = Mixpanel.init(CONSTANTS.MIXPANEL_PROJECT_TOKEN);
        } catch (e) {
            console.log(e);
        }
    }
    static getToken() {
        try {
            const token = mixpanel.token;
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
            if (!payLoad) {
                payLoad = {};
            }
            if (payLoad) {
                payLoad.IS_SERVER = true;
            }
            payLoad ? mixpanel.track(eventName, payLoad) : mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
}
