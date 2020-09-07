const CONSTANTS = {

  URL: {
    LOGOUT: "https://retaillink.login.stg.wal-mart.com/ssologout?postLogoutRedirect=__domain__/logout",
    LOGIN_REDIRECT: "/api/falcon/login",
    REGISTER_REDIRECT: "/api/falcon/register",
    DOMAIN: {
      DEVELOPMENT: "http://localhost:3000",
      STAGING: "http://brandportal.ropro.stg.walmart.com",
      // TODO correct production URL below
      PRODUCTION: "http://brandportal.ropro.stg.walmart.com"
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
      IMAGE: "Alert",
      MESSAGE: "Your company and brand details are currently being verified. Once complete, we will send a confirmation to your registered email. Please login using the shared link.",
      TITLE: "Company Registration is Pending"
    },
    PORTAL_DASHBOARD: {
      CODE: 4
    },
    PORTAL_ACCESS_REVOKED: {
      CODE: 8,
      IMAGE: "Alert",
      MESSAGE: "Your company account access has been revoked for security reasons",
      TITLE: "Access Denied"
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
      IMAGE: "Alert",
      MESSAGE: "Your account details need to be verified. A verification email has been sent to your email address. Please verify using the link provided.",
      TITLE: "Account verification in progress"
    }
  },

  ROUTES: {
    ROOT_PATH: "/",
    DEFAULT_REDIRECT_PATH_SUPERADMIN: "/users/user-list",
    DEFAULT_REDIRECT_PATH_ADMIN: "/brands",
    DEFAULT_REDIRECT_PATH_REPORTER: "/claims",

    ONBOARD: {
      COMPANY_REGISTER: "/onboard/company",
      BRAND_REGISTER: "/onboard/brand"
    },

    USER_MGMT: {
      USER_LIST: "/users/user-list",
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
      HELP: "/help"
    }
  },

  NAVIGATION_PANEL: [
    { id: "1", name: "CLAIMS", value: "CLAIMS", href: "/claims", active: false},
    { id: "2", name: "BRANDS", value: "BRANDS", href: "/brands", active: false},
    {
      id: "3",
      name: "USERS",
      value: "USERS",
      href: "/user-management",
      children: [
        { id: "31", name: "USERLIST", value: "User List", href: "/users/user-list", active: true},
        { id: "32", name: "APPROVALLIST", value: "Approval List", href: "/users/user-approval", active: false}
      ]
    }
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
      NEW: "New",
      PENDING: "Pending Activation",
      ACTIVE: "Active",
      SUSPENDED: "Suspended",
      REJECTED: "Rejected"
    },
    OPTIONS: {
      DISPLAY: {
        EDIT: "Edit User Profile",
        RESENDINVITE: "Resend Invite",
        SUSPEND: "Deactivate User Profile",
        REACTIVATE: "Reactivate User",
        DELETE: "Delete User Profile"
      },
      PAYLOAD: {
        SUSPEND: "Suspended",
        ACTIVE: "Active"
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
        SUSPEND: "Deactivate Brand",
        REACTIVATE: "Reactivate Brand",
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
    REGISTER_TEXT: "Register Now",
    IMAGE_WALMART_INTRO: "WalmartIntro",
    CONTACTTEXT: "If you have more questions or wish to know more, contact us at ",
    CONTACTEMAIL: "support@brandportal.com",
    COPYRIGHTTEXT: "© 2020 Walmart. All rights reserved.",
    PRIVACYTEXT: "Privacy Policy",
    PRIVACYURL: ""
  },

  ONGOING_CLAIM_TYPES: {
    TRADEMARK: "trademark",
    PATENT: "patent",
    COUNTERFEIT: "counterfeit",
    COPYRIGHT: "copyright"
  },

  REGEX: {
    ZIP: "\\d{5}(?:[-\s]\\d{4})?$",
    EMAIL: "\\S+@\\S+\.\\S+",
    PHONE: "^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$",
    ZIPERROR: "Zip Code is invalid, expected format is [xxxxx] or [xxxxx-xxxx].",
    EMAILERROR: "Please enter a valid Email ID.",
    PHONEERROR: "Plase enter a valid phone number.",
    CLAIMDETAILSPATH: "^\/claims\/[a-zA-Z0-9\-]*$",
    REDIRECTALLOWEDPATHS: "^\/((claims|brands|users)|(claims|brands|users)\/[a-zA-Z0-9\-]*)$"
  },

  POPOVERSELECTOR: "tutorialPopover",
  APIDEBOUNCETIMEOUT: 800
};

export default CONSTANTS;
