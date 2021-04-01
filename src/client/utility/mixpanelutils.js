/* eslint-disable no-undef */
/* eslint-disable no-console */
import mixpanel from "mixpanel-browser";
import CONSTANTS from "../constants/constants";
import MIXPANEL_CONSTANTS from "../constants/MixPanelConsants";

export default class MixpanelUtils {
    static async trackBatchOfSameType(eventName, payload) {
        const adaptedPayload = payload && payload.map(element => {
            const elementCloned = {};
            elementCloned.event = eventName;
            elementCloned.properties = element;
            elementCloned.properties.USER_TYPE = mixpanel.get_property("USER_TYPE");
            elementCloned.properties.$email = mixpanel.get_property("$email");
            elementCloned.propertiesROLE = mixpanel.get_property("ROLE");
            elementCloned.properties.$name = mixpanel.get_property("$name");
            // eslint-disable-next-line camelcase
            elementCloned.properties.distinct_id = mixpanel.get_property("$user_id");
            elementCloned.properties.token = mixpanel.get_config("token");
            return elementCloned;
        });
        const encodedParams = new URLSearchParams();
        encodedParams.set("ip", "1");
        encodedParams.set("data", JSON.stringify(adaptedPayload));
        const options = {
            method: "POST",
            headers: {Accept: "text/plain", "Content-Type": "application/x-www-form-urlencoded"},
            body: encodedParams
          };
          try {
            let response = await fetch("https://api.mixpanel.com/track#past-events-batch", options);
            response = await response.json();
            console.log(response);
          } catch (e) {
            console.log(e);
          }
    }

    static intializeMixpanel(projectToken) {
        try {
        // eslint-disable-next-line camelcase
          mixpanel.init(projectToken, {api_host: "https://api.mixpanel.com"});
        } catch (e) {
            console.log(e);
        }
    }
    static setUserProfile(userProfile) {
        mixpanel.identify(userProfile.email);
        const payload = {
            $email: userProfile.email,
            $name: `${userProfile.firstName } ${ userProfile.lastName}`,
            DATE_ADDED: userProfile.createTs ? userProfile.createTs : "",
            CREATED_BY: userProfile.createdBy ? userProfile.createdBy : "",
            ORG_ID: userProfile.organization.id,
            ORG_NAME: userProfile.organization.name,
            USER_ROLE: userProfile.role.name,
            USER_TYPE: userProfile.type,
            LAST_UPDATED_BY: userProfile.lastUpdatedBy
        };
        mixpanel.people.set_once(payload);
    }
    static setSuperProperties(userProfile) {
        const superPropertyPayLoad = {
            $email: userProfile.email,
            $name: `${userProfile.firstName } ${ userProfile.lastName}`,
            USER_TYPE: userProfile.type ? userProfile.type : "",
            ROLE: userProfile.role.name ? userProfile.role.name : ""
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
        if (!userId || userId !== userProfile.email) {
            mixpanel.reset();
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
        const eventName = MIXPANEL_CONSTANTS.ADD_NEW_TEMPLATE_MAPPING[templateName];
        MixpanelUtils.trackEvent(eventName, payload);
    }
    static helpSectionEvents(eventName, payLoad) {
        let helpId = payLoad.id;
        helpId = helpId.split("-")[0];
        const updatedPayload = {
            HELP_TOPIC: MIXPANEL_CONSTANTS.HELP_TOPIC_MAPPING[helpId],
            WORK_FLOW: "HELP_EVENTS"
        };
        if (payLoad.question) updatedPayload.QUESTION = payLoad.question;
        MixpanelUtils.trackEvent(eventName, updatedPayload);
    }
    static submitNCUtil(eventName, payload) {
        const items = payload.items;
        const mixpanelPayload = items && items.map(item => {
            const eventPayload = {};
            eventPayload.SELLER_NAME = item.sellerName;
            eventPayload.ITEM_URL = item.itemUrl;
            eventPayload.CLAIM_TYPE = payload.claimType;
            eventPayload.BRAND_ID = payload.brandId;
            eventPayload.USPTO_URL = payload.usptoUrl;
            eventPayload.USPTO_VERIFICATION = payload.usptoVerification;
            return eventPayload;
        });

        console.log(mixpanelPayload);
        MixpanelUtils.trackBatchOfSameType(eventName, mixpanelPayload);
    }
}


