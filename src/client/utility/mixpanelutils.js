import mixpanel from "mixpanel-browser";
import CONSTANTS from "../constants/constants";
import MIXPANEL_CONSTANTS from "../constants/MixPanelConsants";

export default class MixpanelUtils {
    static intializeMixpanel() {
        try {
        mixpanel.init(CONSTANTS.MIXPANEL.PROJECT_TOKEN);
        } catch (e) {
            console.log(e);
        }
    }
    static setUserProfile(userProfile) {
        mixpanel.identify(userProfile.email);
        const payload = {
            $email: userProfile.email,
            $name: userProfile.firstName + userProfile.lastName,
            "Date added": userProfile.createTs ? userProfile.createTs : "",
            "Created By": userProfile.createdBy ? userProfile.createdBy : ""
        };
        mixpanel.people.set_once(payload);
    }
    static setSuperProperties(userProfile) {
        const superPropertyPayLoad = {
            $email: userProfile.email,
            $name: userProfile.firstName + userProfile.lastName,
            "User Type": userProfile.type ? userProfile.type : "",
            Role: userProfile.role.name ? userProfile.role.name : ""
        };
        mixpanel.register(superPropertyPayLoad);
    }
    static trackEvent(eventName, payLoad) {
        try {
            payLoad ? mixpanel.track(eventName, payLoad) : mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static login(userProfile, eventName) {
        try {
        const userId = mixpanel.get_property("$user_id");
        if (!userId) {
            MixpanelUtils.setUserProfile(userProfile);
            MixpanelUtils.setSuperProperties(userProfile);
            MixpanelUtils.trackEvent(eventName);
        }
        } catch (e) {
            console.log(e);
        }
    }

    static logout(eventName) {
        try {
        MixpanelUtils.trackEvent(eventName);
        mixpanel.reset();
        } catch (e) {
            console.log(e);
        }
    }
    static addNewTemplate(meta, payload) {
        const templateName = meta.templateName;
        const eventName = MIXPANEL_CONSTANTS.ADD_NEW_TEMPLATE[templateName];
        MixpanelUtils.trackEvent(eventName, payload);
    }
    static helpSectionEvents(eventName, payLoad) {
        let helpId = payLoad.id;
        helpId = helpId.split("-")[0];
        const updatedPayload = {
            HELP_TOPIC: MIXPANEL_CONSTANTS.HELP_TOPIC_MAPPING[helpId],
            WORK_FLOW: "HELP EVENTS"
        };
        if (payLoad.question) updatedPayload.QUESTION = payLoad.question;
        MixpanelUtils.trackEvent(eventName, updatedPayload);
    }
}


