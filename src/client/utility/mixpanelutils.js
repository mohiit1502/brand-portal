/* eslint-disable no-undef */
/* eslint-disable no-console */
import mixpanel from "mixpanel-browser";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";

export default class MixpanelUtils {
    static async trackEventBatch(eventName, payload) {
        const adaptedPayload = payload && payload.map(element => {
            const elementCloned = {};
            elementCloned.event = eventName;
            elementCloned.properties = element;
            elementCloned.properties.IS_SERVER = false;
            elementCloned.properties.USER_TYPE = mixpanel.get_property("USER_TYPE");
            elementCloned.properties.$email = mixpanel.get_property("$email");
            elementCloned.properties.USER_ROLE = mixpanel.get_property("ROLE");
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
    static getToken() {
        try {
            const token =  mixpanel && mixpanel.get_config("token");
            return token;
        } catch (e) {
            //console.log(e);
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
            ORG_ID: userProfile.organization ? userProfile.organization.id : "",
            ORG_NAME: userProfile.organization ? userProfile.organization.name : "",
            USER_ROLE: userProfile.role ? userProfile.role.name : userProfile.role.name,
            USER_TYPE: userProfile.type ? userProfile.type : "",
            LAST_UPDATED_BY: userProfile.lastUpdatedBy ? userProfile.lastUpdatedBy : ""
        };
        mixpanel.people.set_once(payload);
    }
    static setSuperProperties(userProfile) {
        const superPropertyPayLoad = {
            $email: userProfile.email,
            $name: `${userProfile.firstName } ${ userProfile.lastName}`,
            USER_TYPE: userProfile.type ? userProfile.type : "",
            ROLE: userProfile.role ? userProfile.role.name : ""
        };
        mixpanel.register(superPropertyPayLoad);
    }
    static trackEvent(eventName, payLoad) {
        try {
            if (!payLoad) {
                payLoad = {};
            }
            payLoad.IS_SERVER = false;
           MixpanelUtils.getToken() && payLoad ? mixpanel.track(eventName, payLoad) : mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static setAlias(userProfile) {
        try {
        const userId = userProfile.email;
            if (userId) {
                const distinctId = mixpanel.get_property("distinct_id");
                mixpanel.alias(userId, distinctId);
            }
        } catch (e) {
            console.log(e);
        }
    }
    static login(userProfile, eventName) {
        try {
        const userId = mixpanel.get_property("$user_id");
        if (!userId || userId !== userProfile.email) {
            //mixpanel.reset();
            MixpanelUtils.setAlias(userProfile);
            MixpanelUtils.setUserProfile(userProfile);
            MixpanelUtils.setSuperProperties(userProfile);
            MixpanelUtils.trackEvent(eventName);
        }
        } catch (e) {
            console.log(e);
        }
    }

    static logout(eventName, payLoad) {
        try {
        MixpanelUtils.trackEvent(eventName, payLoad);
        mixpanel.reset();
        } catch (e) {
            console.log(e);
        }
    }
}
