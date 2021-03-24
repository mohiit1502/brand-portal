
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
        CHECK_TRADEMARK_AVAILIBITY_FIALURE: "TEST: Trade mark Avialibilty failure",
        CHECK_EMAIL_AVAILIBITY_SUCCESS: "TEST: Email Avialibilty success",
        CHECK_EMAIL_AVAILIBITY_FIALURE: "TEST: Email Avialibilty failure"
    },
    FILE_UPLOAD_EVENTS: {
        FILE_UPLOAD_SUCCESS: "TEST: File Upload Success",
        FILE_UPLOAD_FAILURE: "TEST: File Upload Failure"
    },
    NEW_CLAIM_TEMPLATE_EVENTS: {
        NEW_CLAIM_TEMPLATE: "TEST: New Claim template",
        ADD_ITEM_TO_CLAIM_LIST: "TEST: Add item to claim list",
        REMOVE_ITEM_TO_CLAIM_LIST: "TEST: REMOVE item from claim list",
        GET_SELLERS_NAME_SUCCESS: "TEST: Fetch Seller name(for item url) Success",
        GET_SELLERS_NAME_FAILURE: "TEST: Fetch Seller name(for item url) failure",
        SUBMIT_CLAIM_SUCCESS: "TEST: Submit new claim success",
        SUBMIT_CLAIM_FAILURE: "TEST: Submit new claim failure",
        RESET_CLAIM_DETAILS: "TEST: Reset Claim Details"
    },
    NEW_BRANDS_TEMPLATE_EVENTS: {
        ADD_NEW_BRAND: "TEST: Add new Brand",
        SUBMIT_NEW_BRAND_SUCCESS: "TEST: Submit new Brand success",
        SUBMIT_NEW_BRAND_FAILURE: "Test: Submit new Brand Failure",
        RESET_BRAND_DETAILS: "TEST: Reset Brand Details"
    },
    INVITE_NEW_USER_TEMPLATE_EVENTS: {
        ADD_NEW_USER: "TEST: Add new User",
        SUBMIT_NEW_USER_SUCCESS: "TEST: Submit new User success",
        SUBMIT_NEW_USER_FAILURE: "Test: Submit new User Failure",
        RESET_USER_DETAILS: "TEST: Reset User Details"
    },
    HOME_PAGE_EVENTS: {
        WBP_HOME_PAGE: "TEST: WBP Home page",
        LOGIN_CLICK_EVENT: "TEST: LogIn click event",
        REGISTER_CLICK_EVENT: "TEST: Register click event"
    },
    USER_PROFILE: {
        VIEW_USER_PROFILE: "TEST: View User Profile",
        CHANGE_PASSWORD: {
            CHANGE_USER_PASSWORD: "TEST: Change User PassWord",
            CANCLE_CHANGE_PASSWORD: "TEST: Cancle Reset Password",
            SAVE_PASSWORD_SUCCESS: "TEST: Reset Password Success",
            SAVE_PASSWORD_FAILURE: "TEST: Reset Password Failure"
        },
        EDIT_USER_PROFILE: {
            EDIT_USER_PROFILE: "TEST: Edit User Profile",
            CANCLE_EDIT_USER_PROFILE: "TEST: Cancel Edit User Profile",
            SAVE_USER_PROFILE: "TEST: Save User Profile"
        }
    },
    HELP_CENTER_EVENTS: {
        VIEW_HELP_TOPICS: "TEST: View Help Topics"
    },
    ADD_NEW_TEMPLATE: {
        NewClaimTemplate: "TEST: New Claim template",
        NewBrandTemplate: "TEST: Add new Brand",
        CreateUserTemplate: "TEST: Add new User"
    },
    LEFT_NAV_EVENTS: {
        VIEW_MY_DASHBOARD: "TEST: View My Dashboard",
        VIEW_MY_CLAIMS: "TEST: View My Claims",
        VIEW_MY_BRANDS: "TEST: View My Brands",
        VIEW_MY_USERS: "TEST: View My Users"
    }
};

export default MIXPANEL_CONSTANTS;
