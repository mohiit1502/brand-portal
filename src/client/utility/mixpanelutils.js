/* eslint-disable no-undef, no-console, camelcase, no-unused-expressions */
import mixpanel from "mixpanel-browser";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";

export default class MixpanelUtils {
    static async trackEventBatch(eventName, payload) {
        if (MixpanelUtils.enableTracking) {
            try {
                const adaptedPayload = payload && payload.map(element => {
                    const elementCloned = {};
                    elementCloned.event = eventName;
                    elementCloned.properties = element;
                    elementCloned.properties.IS_SERVER = false;
                    if (mixpanel.get_property("USER_TYPE")) elementCloned.properties.USER_TYPE = mixpanel.get_property("USER_TYPE");
                    if (mixpanel.get_property("$email")) elementCloned.properties.$email = mixpanel.get_property("$email");
                    if (mixpanel.get_property("ROLE")) elementCloned.properties.USER_ROLE = mixpanel.get_property("ROLE");
                    if (mixpanel.get_property("$name")) elementCloned.properties.$name = mixpanel.get_property("$name");
                    if (mixpanel.get_property("$user_id")) elementCloned.properties.$user_id = mixpanel.get_property("$user_id");
                    if (mixpanel.get_property("$user_id")) elementCloned.properties.distinct_id = mixpanel.get_property("$user_id");
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
                const response = await fetch("https://api.mixpanel.com/track#past-events-batch", options);
                await response.json();
            } catch (e) {
                console.log(e);
            }
        }
    }

    static getToken() {
        if (MixpanelUtils.enableTracking) {
            try {
                const token =  mixpanel && mixpanel.get_config("token");
                return token;
            } catch (e) {
                //console.log(e);
            }
        }
        return "";
    }

    static intializeMixpanel(projectToken, enableTracking) {
        if (enableTracking) {
            try {
                // eslint-disable-next-line camelcase
                mixpanel.init(projectToken, {api_host: "https://api.mixpanel.com"});
                MixpanelUtils.enableTracking = enableTracking;
                !enableTracking && mixpanel.disable();
            } catch (e) {
                console.log(e);
            }
        }
    }

    static setUserProfile(userProfile) {
        try {
            if (userProfile) {
                const payload = {
                    $email: userProfile.email,
                    $name: `${userProfile.firstName } ${ userProfile.lastName}`,
                    $user_id: userProfile.email,
                    DATE_ADDED: userProfile.createTs ? userProfile.createTs : "",
                    CREATED_BY: userProfile.createdBy ? userProfile.createdBy : "",
                    ORG_ID: userProfile.organization ? userProfile.organization.id : "",
                    ORG_NAME: userProfile.organization ? userProfile.organization.name : "",
                    USER_ROLE: userProfile.role ? userProfile.role.name : "",
                    USER_TYPE: userProfile.type ? userProfile.type : "",
                    LAST_UPDATED_BY: userProfile.lastUpdatedBy ? userProfile.lastUpdatedBy : ""
                };
                mixpanel.people.set(payload);
            }
       } catch (e) {
           console.log(e);
       }
    }

    static setSuperProperties(userProfile) {
        try {
            if (userProfile) {
                const superPropertyPayLoad = {
                    $email: userProfile.email,
                    $name: `${userProfile.firstName } ${ userProfile.lastName}`,
                    USER_TYPE: userProfile.type ? userProfile.type : "NOT_FOUND",
                    ROLE: userProfile.role ? userProfile.role.name : "NOT_FOUND",
                    EMAIL_VERIFIED: userProfile.emailVerified,
                    STATUS: userProfile.status
                };
                mixpanel.register(superPropertyPayLoad);
            }
        } catch (e) {
        console.log(e);
        }
    }

    static trackEvent(eventName, payload) {
        if (MixpanelUtils.enableTracking) {
            try {
                payload = payload ? payload : {};
                payload.IS_SERVER = false;
                MixpanelUtils.getToken() && payload ? mixpanel.track(eventName, payload) : mixpanel.track(eventName);
            } catch (e) {
                console.log(e);
            }
        }
    }

    static setAlias(logInId) {
        try {
            if (logInId) {
                mixpanel.alias(logInId);
            }
        } catch (e) {
            console.log(e);
        }

    }

    static login(logInId, eventName) {
        if (MixpanelUtils.enableTracking) {
            try {
                const userId = mixpanel.get_property("$user_id");
                if (!userId || userId !== logInId) {
                    //mixpanel.reset();
                    MixpanelUtils.setAlias(logInId);
                    mixpanel.identify(logInId);
                    MixpanelUtils.trackEvent(eventName, {$email: logInId});
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    static setUserProperty(userProfile) {
        try {
            MixpanelUtils.setUserProfile(userProfile);
            MixpanelUtils.setSuperProperties(userProfile);
        } catch (e) {
            console.log(e);
        }
    }

    static logout(eventName, payLoad) {
        if (MixpanelUtils.enableTracking) {
            try {
            MixpanelUtils.trackEvent(eventName, payLoad);
            MixpanelUtils.clearCookies();
            } catch (e) {
                console.log(e);
            }
        }
    }

    static clearCookies() {
        try {
            mixpanel.reset();
        } catch (e) {
            console.log(e);
        }
    }

    /* eslint-disable complexity, max-statements */
    static populateProfileInfo(profile) {
        const mixpanelPayload = {};
        if (profile) {
            mixpanelPayload.EMAIL_VERIFIED = profile && profile.emailVerified;
            mixpanelPayload.ORGANISATION_NAME = profile && profile.organization ? profile.organization.name : "NOT_SET";
            mixpanelPayload.ORGANISATION_STATUS = profile && profile.organization ? profile.organization.status : "NOT_SET";
            mixpanelPayload.STATUS = profile && profile.status ? profile.status : "NOT_SET";
            mixpanelPayload.REGISTRATION_MODE = profile && profile.registrationMode ? profile.registrationMode : "NOT_SET";
            mixpanelPayload.FIRST_NAME = profile && profile.firstName ? profile.firstName : "NOT_SET";
            mixpanelPayload.LAST_NAME = profile && profile.lastName ? profile.lastName : "NOT_SET";
            mixpanelPayload.ROLE = profile && profile.role ? profile.role.name : "NOT_SET";
            mixpanelPayload.USER_TYPE = profile && profile.type ? profile.type : "NOT_SET";
            mixpanelPayload.STATUS_DETAILS = profile && profile.statusDetails ? profile.statusDetails : "NOT_SET";
            mixpanelPayload.IS_USER_ENABLED = profile && profile.isUserEnabled;
            mixpanelPayload.IS_ORG_ENABLED = profile && profile.isOrgEnabled;
            const workflow = profile && profile.workflow && profile.workflow.code ? profile.workflow.code : 0;
            mixpanelPayload.WORK_FLOW = MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[workflow] || "CODE_NOT_FOUND";
        }
        return mixpanelPayload;
    }
}
