
const MIXPANEL_CONSTANTS = {
    LOGIN: {
        USER_LOGIN: "LOGIN"
    },
    LOGOUT: {
        USER_LOGOUT: "LOGOUT"
    },
    COMPANY_REGISTRATION: {
        CREATE_COMPANY_PROFILE: "Create Company Profile",
        RESET_COMPANY_PROFILE: "Reset Company Profile",
        COMPANY_UNIQUENESS_CHECK_FAIURE: "Company uniqueness service failure",
        BRAND_REGISTRATION: "Brand Registration",
        COMPANY_ONBOARDING_SUCCESS: "Company onboarding details submission succcess",
        COMPANY_ONBOARDING_FAILURE: "Company onboarding details submission failure"
    },
    VALIDATION_EVENTS: {
        CHECK_COMPANY_NAME_AVIAILIBILITY_SUCCESS: "Company name Availibility success",
        CHECK_COMPANY_NAME_AVIAILIBILITY_FAILURE: "Company name Availibility failure",
        CHECK_BRAND_UNIQUENESS_SUCCESS: "Brand Name uniqueness check success",
        CHECK_BRAND_UNIQUENESS_FAILURE: "Brand Name uniqueness check failure",
        CHECK_TRADEMARK_AVAILIBITY_SUCCESS: "Trade mark Avialibilty success",
        CHECK_TRADEMARK_AVAILIBITY_FIALURE: "Trade mark Avialibilty failure",
        CHECK_EMAIL_AVAILIBITY_SUCCESS: "Email Avialibilty success",
        CHECK_EMAIL_AVAILIBITY_FIALURE: "Email Avialibilty failure"
    },
    FILE_UPLOAD_EVENTS: {
        FILE_UPLOAD_SUCCESS: "File Upload Success",
        FILE_UPLOAD_FAILURE: "File Upload Failure"
    },
    NEW_CLAIM_TEMPLATE_EVENTS: {
        NEW_CLAIM_TEMPLATE: "New Claim template",
        ADD_ITEM_TO_CLAIM_LIST: "Add item to claim list",
        REMOVE_ITEM_TO_CLAIM_LIST: "REMOVE item from claim list",
        GET_SELLERS_NAME_SUCCESS: "Fetch Seller name(for item url) Success",
        GET_SELLERS_NAME_FAILURE: "Fetch Seller name(for item url) failure",
        SUBMIT_CLAIM_SUCCESS: "Submit new claim success",
        SUBMIT_CLAIM_FAILURE: "Submit new claim failure",
        RESET_CLAIM_DETAILS: "Reset Claim Details"
    },
    NEW_BRANDS_TEMPLATE_EVENTS: {
        ADD_NEW_BRAND: "Add new Brand",
        SUBMIT_NEW_BRAND_SUCCESS: "Submit new Brand success",
        SUBMIT_NEW_BRAND_FAILURE: "Submit new Brand Failure",
        RESET_BRAND_DETAILS: "Reset Brand Details"
    },
    INVITE_NEW_USER_TEMPLATE_EVENTS: {
        ADD_NEW_USER: "Add new User",
        SUBMIT_NEW_USER_SUCCESS: "Submit new User success",
        SUBMIT_NEW_USER_FAILURE: "Submit new User Failure",
        RESET_USER_DETAILS: "Reset User Details"
    },
    HOME_PAGE_EVENTS: {
        WBP_HOME_PAGE: "WBP Home page",
        LOGIN_CLICK_EVENT: "LogIn click event",
        REGISTER_CLICK_EVENT: "Register click event"
    },
    USER_PROFILE: {
        VIEW_USER_PROFILE: "View User Profile",
        CHANGE_PASSWORD: {
            CHANGE_USER_PASSWORD: "Change User PassWord",
            CANCLE_CHANGE_PASSWORD: "Cancle Reset Password",
            SAVE_PASSWORD_SUCCESS: "Reset Password Success",
            SAVE_PASSWORD_FAILURE: "Reset Password Failure"
        },
        EDIT_USER_PROFILE: {
            EDIT_USER_PROFILE: "Edit User Profile",
            CANCLE_EDIT_USER_PROFILE: "Cancel Edit User Profile",
            SAVE_USER_PROFILE: "Save User Profile"
        }
    },
    HELP_CENTER_EVENTS: {
        VIEW_HELP_TOPICS: "View Help Topics"
    },
    ADD_NEW_TEMPLATE: {
        NewClaimTemplate: "New Claim template",
        NewBrandTemplate: "Add new Brand",
        CreateUserTemplate: "Add new User"
    },
    LEFT_NAV_EVENTS: {
        VIEW_MY_DASHBOARD: "View My Dashboard",
        VIEW_MY_CLAIMS: "View My Claims",
        VIEW_MY_BRANDS: "View My Brands",
        VIEW_MY_USERS: "View My Users"
    }
};

export default MIXPANEL_CONSTANTS;
