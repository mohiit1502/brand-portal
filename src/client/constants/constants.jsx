const CONSTANTS = {

  URL: {
    LOGOUT: "https://retaillink.login.wal-mart.com/ssologout?postLogoutRedirect=__domain__/logout",
    // LOGOUT: "https://retaillink.login.stg.wal-mart.com/ssologout?postLogoutRedirect=__domain__/logout",
    LOGIN_REDIRECT: "/api/falcon/login",
    REGISTER_REDIRECT: "/api/falcon/register",
    DOMAIN: {
      DEVELOPMENT: "http://localhost:3000",
      STAGING: "http://brandportal.ropro.stg.walmart.com",
      // TODO correct production URL below
      PRODUCTION: "https://brandportal.walmart.com"
      // PRODUCTION: "http://brandportal.ropro.stg.walmart.com"
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
    PORTAL_REGISTRATION: {
      CODE: 1
    },
    PORTAL_VERIFICATION: {
      CODE: 2,
      IMAGE: "Arrow",
      MESSAGE: "Once complete, we will send a confirmation to your registered email.\n Please login using the shared link.",
      TITLE: "Your company and brand details are being verified"
    },
    PORTAL_DASHBOARD: {
      CODE: 4
    },
    PORTAL_ACCESS_REVOKED: {
      MESSAGE: {
        "classes": "mt-4 mx-4 access-revoke",
        "content": {
          "partial1": {
          "chunk1": "Please contact us at ",
          "anchor1": {
              "text": "brandportal@walmart.com",
              "href": "mailto:brandportal@walmart.com"
            },
            "chunk2": " if you would still like to create an account",
          }
        }
      },
      CODE: 8,
      IMAGE: "Alert",
      SUBTITLE: "We have not been able to verify the information provided for your application.",
      TITLE: "Application On Hold"
    },
    USER_ACCESS_REVOKED: {
      CODE: 16,
      IMAGE: "RedCircleCross",
      MESSAGE: "Your account access has been revoked for security reasons",
      TITLE: "Access Denied"
    },
    REQUEST_ACCESS: {
      CODE: 32,
      IMAGE: "GreenCircleCheck",
      MESSAGE: "Access Request, awaiting approval.",
      TITLE: "Access requested"
    },
    USER_VERIFICATION: {
      CODE: 64,
      IMAGE: "EmailIcon",
      MESSAGE: "A verification email has been sent to your email address.\nPlease verify using the link provided.",
      TITLE: "Email verification required"
    },
    TOU_VERIFICATION: {
      CODE: 128,
      FILE: "test.pdf",
      GENERIC: true
    },
    ERRORCODES: {
      FORBIDDEN: "403",
      FOURNOTFOUR: "404",
      UNAUTHORIZED: 401,
      SERVERDOWN: 500,
      SERVERDOWNWRAPPER: 520,
      SERVERERROR: "^[4,5]\\d{2}$"
    }
  },

  ROUTES: {
    PROTECTED: {
      ROOT_PATH: "/",
      // DEFAULT_REDIRECT_PATH_SUPERADMIN: "/users/user-list",
      DEFAULT_REDIRECT_PATH_SUPERADMIN: "/users",
      DEFAULT_REDIRECT_PATH_ADMIN: "/brands",
      DEFAULT_REDIRECT_PATH_REPORTER: "/claims",

      ONBOARD: {
        COMPANY_REGISTER: "/onboard/company",
        BRAND_REGISTER: "/onboard/brand"
      },

      USER_MGMT: {
        // USER_LIST: "/users/user-list",
        USER_LIST: "/users",
        USER_APPROVAL: "/users/user-approval"
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
      FAQ:"/help/faq",
      USER:"/help/user",
      CLAIM:"/help/claim",
      BRAND:"/help/brand",
      CONTACT:"/help/contact"
    },

      DASHBOARD: "/dashboard"
    },
    OPEN: {
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
      REJECTED: "Rejected",
      SUSPENDED: "Suspended",
      TOU_NOT_ACCEPTED: "Invitation Not Accepted"
    },
    UNIQUENESS_CHECK_STATUS: {
      EMAIL: "EMAIL",
      DENY: "DENY",
      KRAKEN: "KRAKEN"
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
        "Suspended": "Inactive",
        "Pending Supplier Activation": "Pending Activation"
      }
    }
  },

  BRAND: {
    SECTION_TITLE_SINGULAR: "Brand",
    SECTION_TITLE_PLURAL: "Brands",
    STATUS: {
      PENDING: "Pending Verification",
      VERIFIED: "Verified",
      SUSPENDED: "Suspended",
      REJECTED: "Rejected"
    },
    OPTIONS: {
      DISPLAY: {
        EDIT: "Edit Brand Details",
        SUSPEND: "Suspend Brand",
        REACTIVATE: "Activate Brand",
        DELETE: "Delete Brand"
      },
      PAYLOAD: {
        VERIFIED: "Verified",
        SUSPEND: "Suspended",
        ACTIVE: "Active"
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
    PRIVACYURL: ""
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
    PHONE: "^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$",
    REDIRECTALLOWEDPATHS: "^\/((claims|brands|users)|(claims|brands|users)\/[a-zA-Z0-9\-]*)$",
    ZIP: "\\d{5}(?:[-\s]\\d{4})?$"
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
