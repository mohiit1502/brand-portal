
const MIXPANEL_CONSTANTS = {
    LOGIN: {
        USER_LOGIN: "TEST:LOGIN"
    },
    LOGOUT: {
        USER_LOGOUT: "TEST:LOGOUT"
    },
    COMPANY_REGISTRATION: {
        CREATE_COMPANY_PROFILE: "TEST: Create Company Profile",
        RESET_COMPANY_PROFILE: "TEST: Reset Company Profile",
        COMPANY_UNIQUENESS_CHECK_FAIURE: "TEST:Company uniqueness service failure",
        BRAND_REGISTRATION: "TEST:Brand Registration",
        COMPANY_ONBOARDING_SUCCESS: "TEST: Company onboarding details submission succcess",
        COMPANY_ONBOARDING_FAILURE: "TEST: Company onboarding details submission failure"
    },
    VALIDATION_EVENTS: {
        CHECK_COMPANY_NAME_AVIAILIBILITY_SUCCESS: "TEST: Company name Availibility success",
        CHECK_COMPANY_NAME_AVIAILIBILITY_FAILURE: "TEST: Company name Availibility failure",
        CHECK_BRAND_UNIQUENESS_SUCCESS: "TEST: Brand Name uniqueness check success",
        CHECK_BRAND_UNIQUENESS_FAILURE: "TEST: Brand Name uniqueness check failure",
        CHECK_TRADEMARK_AVAILIBITY_SUCCESS: "TEST: Trade mark Avialibilty success",
        CHECK_TRADEMARK_AVAILIBITY_FIALURE: "TEST: Trade mark Avialibilty failure"
    },
    FILE_UPLOAD_EVENTS: {
        FILE_UPLOAD_SUCCESS: "TEST: File Upload Success",
        FILE_UPLOAD_FAILURE: "TEST: File Upload Failure"
    }
};
export default MIXPANEL_CONSTANTS;
