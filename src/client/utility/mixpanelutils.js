import mixpanel from "mixpanel-browser";
import CONSTANTS from "../constants/constants";
import MIXPANEL_CONSTANTS from "../constants/MixPanelConsants";

export default class MixpanelUtils {
    static intializeMixpanel() {
        try {
        mixpanel.init(CONSTANTS.MIXPANEL.PROJECT_ID);
        } catch (e) {
            console.log(e);
        }
    }
    static setUserProfile(userProfile) {
        mixpanel.identify(userProfile.email);
        const payload = {
            $email: userProfile.email,
            $name: userProfile.firstName + userProfile.lastName,
            "Date added": userProfile.createTs,
            "Created By": userProfile.createdBy
        };
        mixpanel.people.set_once(payload);
    }
    static setSuperProperties(userProfile) {
        const superPropertyPayLoad = {
            $email: userProfile.email,
            $name: userProfile.firstName + userProfile.lastName,
            "User Type": userProfile.type,
            Role: userProfile.role.name
        };
        mixpanel.register(superPropertyPayLoad);
    }
    static trackEvent(eventName, payLoad) {
        try {
            payLoad ? mixpanel.track(eventName, payLoad) : mixpanel.track(eventName);
        } catch (e) {
            MixpanelUtils.intializeMixpanel();
            console.log(e);
        }
    }

    static clickEvents(eventName) {
        MixpanelUtils.trackEvent(eventName);
    }
    static login(userProfile, eventName) {
        try {
        const distinct_id = mixpanel.get_distinct_id();
        } catch (e) {
            MixpanelUtils.intializeMixpanel();
            MixpanelUtils.setUserProfile(userProfile);
            MixpanelUtils.setSuperProperties(userProfile);
            MixpanelUtils.trackEvent(eventName);
           // mixpanel.track(eventName);
            console.log(e);
        }
    }

    static logout(userProfile, eventName) {
        try {
        mixpanel.track(eventName);
        mixpanel.reset();
        } catch (e) {
            console.log(e);
        }
    }
    static addNewTemplate(meta) {
        const templateName = meta.templateName;
        const eventName = MIXPANEL_CONSTANTS.ADD_NEW_TEMPLATE[templateName];
        console.log(eventName);
    }


    static addBrand(eventName, eventData) {
        try {
            console.log(eventName);
          //  mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static inviteUser(eventName, eventData) {
        try {
            console.log(eventName);
            //mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }

    }
    static fileUploadEvents(eventName, eventData) {
        try {
            mixpanel.track(eventName, eventData);
        } catch (e) {
            console.log(e);
        }
    }
    static brandRegistration(eventData, eventName) {
        try {
            mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static validatorsEvents(eventName) {
        try {
            console.log(eventName);
        mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static newClaimEvents(eventName, eventData) {
        try {

            mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static resetPasswordEvent(eventName, eventData) {
        try {
         //   mixpanel.track(eventName);
         console.log(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static userProfileEvents(eventName, eventData) {
        try {
         //   mixpanel.track(eventName);
         console.log(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static helpEvents(eventName, data) {
        try {
            console.log(eventName);
            const payLoad = {
                id: data.id,
                question: data.question,
                type: data.type
            };
           mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }

//testing
    static homePage() {
        try {
           // mixpanel.init("1968bbc8bf2304c4c850ca1d53e79ea2");
            mixpanel.track("Home Page visit");
        } catch (e) {
            console.log(e);
        }
    }
    static tryEvent(templateName) {

        const USER_ID = "test_user";
        const USER_SIGNUP_DATE = "2020-01-02T21:07:03Z";
        try {
        mixpanel.init("1968bbc8bf2304c4c850ca1d53e79ea2");

        mixpanel.people.set({
        $name: "Deekshith",
        $emai: "abc@walmart.com",
        "Sign up date": USER_SIGNUP_DATE,
        USER_ID
        });
        mixpanel.track("Add claim Event testing", {"tempate name": templateName});
    } catch (e) {
        console.log("[WBP]mixpanel", e);
    }
    }
}


