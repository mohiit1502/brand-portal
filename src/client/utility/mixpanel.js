import mixpanel from "mixpanel-browser";
export default class {
    static login(userProfile, eventName) {
        try { 
        let distinct_id = mixpanel.get_distinct_id();
        } catch (e) {
            mixpanel.init("1968bbc8bf2304c4c850ca1d53e79ea2");
            mixpanel.identify(userProfile.email);
            mixpanel.track(eventName);
            const payload = {
            $email: userProfile.email,
            $name: userProfile.firstName + userProfile.lastName,
            "Date added": userProfile.createTs,
            "Created By": userProfile.createdBy
        };
        mixpanel.people.set_once(payload);
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
    static addBrand(eventName, eventData) {
        try {
            console.log(eventName);
            mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }
    }
    static inviteUser(eventName, eventData) {
        try {
            console.log(eventName);
            mixpanel.track(eventName);
        } catch (e) {
            console.log(e);
        }

    }
    static fileUploadEvents(eventName, eventData) {
        try {
            mixpanel.track(eventName,eventData);
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
    static clickEvents(eventName) {
        try {
            console.log(eventName);
            mixpanel.init("1968bbc8bf2304c4c850ca1d53e79ea2");
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
        }
        catch (e) {
            console.log(e);
        } 
    }
    static tryEvent(templateName) {
        
        var USER_ID = "test_user";
        var USER_SIGNUP_DATE = "2020-01-02T21:07:03Z";
        try{
        mixpanel.init("1968bbc8bf2304c4c850ca1d53e79ea2");
        
        mixpanel.people.set({
        $name: "Deekshith",
        $emai: "abc@walmart.com",    
        "Sign up date": USER_SIGNUP_DATE,    
        "USER_ID": USER_ID,    
        });
        mixpanel.track("Add claim Event testing", {"tempate name": templateName});
    } catch(e) {
        console.log("[WBP]mixpanel",e);
    }
    }
}


