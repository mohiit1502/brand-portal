/* eslint-disable no-magic-numbers */

const CONSTANTS = {

  URL: {
    LOGOUT: "https://retaillink.login.wal-mart.com/ssologout?postLogoutRedirect=__domain__/logout",
    LOGIN_REDIRECT: "/api/falcon/login",
    REGISTER_REDIRECT: "/api/falcon/register",
    DOMAIN: {
      DEVELOPMENT: "http://localhost:3000",
      STAGING: "http://brandportal.ropro.stg.walmart.com",
      // TODO correct production URL below
      PRODUCTION: "https://brandportal.walmart.com"
    },
    DOMAIN_SERVER: {
      DEVELOPMENT: "http://localhost:2992",
      STAGING: "",
      PRODUCTION: ""
    },
    IMAGE: "/js"
  },

  SECTION: {
    CLAIMS: "CLAIMS",
    USERS: "USERS",
    BRANDS: "BRANDS",
    USERLIST: "USERLIST",
    APPROVALLIST: "APPROVALLIST"
  },

  CODES: {
    ERRORCODES: {
      FORBIDDEN: "403",
      FOURNOTFOUR: "404",
      UNAUTHORIZED: 401,
      SERVERDOWN: 500,
      SERVERDOWNWRAPPER: 520,
      SERVERERROR: "^[4,5]\\d{2}$"
    }
  },

  WORKFLOW_CODES: {
    DASHBOARD: 4,
    USER_ACCESS_REVOKED: 16
  },

  ROUTES: {
    PROTECTED: {
      ROOT_PATH: "/",
      DEFAULT_REDIRECT_PATH_SUPERADMIN: "/users",
      DEFAULT_REDIRECT_PATH_ADMIN: "/brands",
      DEFAULT_REDIRECT_PATH_REPORTER: "/claims",

      ONBOARD: {
        COMPANY_REGISTER: "/onboard/company",
        BRAND_REGISTER: "/onboard/brand",
        APPLICATION_REVIEW: "/onboard/review"
      },

      USER_MGMT: {
        USER_LIST: "/users",
      },

      BRANDS: {
        BRANDS_LIST: "/brands"
      },

      CLAIMS: {
        CLAIMS_LIST: "/claims",
        CLAIM_DETAILS: "/claims/:claim_id"
      },

      PROFILE: {
        USER: "/profile"
      },

    HELP: {
      HELP: "/help",
      FAQ: "/help/faq",
      USER: "/help/user",
      CLAIM: "/help/claim",
      BRAND: "/help/brand",
      CONTACT: "/help/contact"
    },

      DASHBOARD: "/dashboard"
    },
    OPEN: {
      LOGIN_TYPE_CTA: "/login",
      REGISTER_TYPE_CTA: "/register",
      SERVICES: "/ipServices"
    }
  },

  NAVIGATION_PANEL: [
    { id: "1", name: "DASHBOARD", value: "My Dashboard", href: "/dashboard", active: false, image: "DashboardIcon"},
    { id: "2", name: "CLAIMS", value: "My Claims", href: "/claims", active: false, image: "ClaimsIcon"},
    { id: "3", name: "BRANDS", value: "My Brands", href: "/brands", active: false, image: "BrandsIcon"},
    // {
    //   id: "3",
    //   name: "USERS",
    //   value: "USERS",
    //   href: "/user-management",
    //   children: [
    //     { id: "31", name: "USERLIST", value: "User List", href: "/users/user-list", active: true},
    //     { id: "32", name: "APPROVALLIST", value: "Approval List", href: "/users/user-approval", active: false}
    //   ]
    // }
    { id: "4", name: "USERS", value: "Users", href: "/users", active: false, image: "UsersIcon"}
  ],

  USER: {
    SECTION_TITLE_SINGULAR: "User",
    SECTION_TITLE_PLURAL: "Users",
    USER_TYPE: {
      THIRD_PARTY: "ThirdParty",
      INTERNAL: "Internal"
    },
    ROLES: {
      ADMIN: "Administrator",
      REPORTER: "Reporter",
      SUPERADMIN: "Super Admin"
    },
    STATUS: {
      ACTIVE: "Active",
      NEW: "New",
      PENDING: "Pending Activation",
      PENDING_SUPPLIER: "Pending Supplier Activation",
      PENDING_SELLER: "Pending Seller Activation",
      REJECTED: "Rejected",
      SUSPENDED: "Suspended",
      TOU_NOT_ACCEPTED: "Invitation Not Accepted"
    },
    UNIQUENESS_CHECK_STATUS: {
      ALLOW: "ALLOW",
      DENY: "DENY"
    },
    OPTIONS: {
      DISPLAY: {
        EDIT: "Edit User Profile",
        RESENDINVITE: "Resend Invite",
        SUSPEND: "Deactivate User",
        REACTIVATE: "Activate User",
        DELETE: "Delete User Profile"
      },
      PAYLOAD: {
        SUSPEND: "Suspended",
        ACTIVE: "Active"
      }
    },
    VALUES: {
      STATUS: {
        Suspended: "Inactive",
        "Pending Supplier Activation": "Pending Activation",
        "Pending Seller Activation": "Pending Activation"
      }
    }
  },

  BRAND: {
    SECTION_TITLE_SINGULAR: "Brand",
    SECTION_TITLE_PLURAL: "Rows",
    STATUS: {
      PENDING: "Pending Verification",
      VERIFIED: "Verified",
      SUSPENDED: "Suspended",
      REJECTED: "Rejected"
    },
    OPTIONS: {
      DISPLAY: {
        EDITBRAND: "Edit Brand",
        ADDTRADEMARK: "Add Trademark"
      },
      PAYLOAD: {
        VERIFIED: "Verified",
        SUSPEND: "Suspended",
        ACTIVE: "Active"
      },
    },
    TRADEMARK: {
      STATUS: {
        PENDING: "Pending Verification",
        ACCEPTED: "ACCEPTED",
        NEW: "New",
        REJECTED: "Rejected"
      },
      OPTIONS: {
        DISPLAY: {
          EDITTRADEMARK: "Edit Trademark",
          DEACTIVATETRADEMARK: "Deactivate Trademark",
          ACTIVATETRADEMARK: "Activate Trademark"
        },
        PAYLOAD: {
          VERIFIED: "Verified",
          SUSPEND: "Suspended",
          ACTIVE: "Active"
        },
      }
    }
  },

  CLAIM: {
    SECTION_TITLE_SINGULAR: "Claim",
    SECTION_TITLE_PLURAL: "Claims",
    STATUS: {

    }
  },

  APPROVAL: {
    SECTION_TITLE_SINGULAR: "Approval",
    SECTION_TITLE_PLURAL: "Approvals",
    STATUS: {

    }
  },

  LOGIN: {
    LANDING_PAGE_TEXT: "Helping you protect your intellectual property on Walmart.com",
    REGISTER_TEXT: "Register",
    IMAGE_WALMART_INTRO: "WalmartIntro",
    CONTACTTEXT: "If you have more questions or wish to know more, contact us at ",
    CONTACTEMAIL: "IPInvest@walmart.com",
    COPYRIGHTTEXT: "© 2021 Walmart. All rights reserved.",
    PRIVACYTEXT: "Privacy Policy",
    PRIVACYURL: "https://corporate.walmart.com/privacy-security"
  },

  NOTIFICATIONPOPUP: {
    DATADELAY: 10000,
    SUCCESSIMAGE: "Verified",
    FAILUREIMAGE: "RedCircleCross",
    CLOSEBUTTONSUCCESS: "TimesSuccess",
    CLOSEBUTTONFAILURE: "TimesFailure"
  },

  ONGOING_CLAIM_TYPES: {
    TRADEMARK: "trademark",
    PATENT: "patent",
    COUNTERFEIT: "counterfeit",
    COPYRIGHT: "copyright"
  },

  REGEX: {
    CLAIMDETAILSPATH: "^\/claims\/[a-zA-Z0-9\-]*$",
    COMPANY: "[a-zA-Z0-9., ]+",
    EMAIL: "(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))",
    NAMES: "^[a-zA-Z0-9. ]+$",
    PASSWORD: "^(?=.*[A-Z]{1,})(?=.*[a-z]{1,})(?=.*[0-9]{1,})(?=.*[~!@#$%^&*()\\-_=+{};:,<.>]{1,}).{8,}$",
    PHONE: "^([+0-9\\s]{3,4})?(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$",
    REDIRECTALLOWEDPATHS: "^\/((claims|brands|users)|(claims|brands|users)\/[a-zA-Z0-9\-]*)$",
    ZIP: "^\\d{5}(?:[-\s]\\d{4})?$"
  },

  ERRORMESSAGES: {
    ZIPERROR: "Zip Code is invalid, expected format is [xxxxx] or [xxxxx-xxxx].",
    EMAILERROR: "Please enter a valid Email ID",
    PHONEERROR: "Please enter a valid phone number"
  },

  SORTSTATE: {
    ASCENDING: 0,
    DESCENDING: 1,
    RESET: 2,
    DATETYPE: "date",
    ARRAYTYPE: "array",
    NUMERICTYPE: "number"
  },
  MIXPANEL: {
    PROJECT_TOKEN: "1968bbc8bf2304c4c850ca1d53e79ea2"
  },
  PENDO: {
    API_KEY: "",
    TRACKING_ENABLED: true
  },
  WEBFORM: {
    CLAIM_SUBMISSION: "1",
    CTA: "2",
    LANDING_PAGE: "0"
  },

  POPOVERSELECTOR: "tutorialPopover",
  APIDEBOUNCETIMEOUT: 800,
  ONCHANGEVALIDATIONTIMEOUT: 300,
  STATUS_CODE_SUCCESS: 200,
  STATUS_CODE_NOT_FOUND: 404,
  STATUS_CODE_400: 400,
  KEY_CODE_BACKSPACE: 8,
  KEY_CODE_TAB: 9,
  KEY_CODE_SHIFT: 16,
  KEY_CODE_END: 35,
  KEY_CODE_HOME: 36,
  KEY_CODE_DELETE: 46,
  ALLOWED_KEY_CODES: [8, 9, 16, 35, 36, 46]
};

export default CONSTANTS;
