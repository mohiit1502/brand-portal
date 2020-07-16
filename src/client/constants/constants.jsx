const CONSTANTS = {

  URL: {
    LOGOUT: "https://retaillink.login.stg.wal-mart.com/ssologout?postLogoutRedirect=__domain__/logout",
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

  TEMPLATE: {
    PORTAL_REGISTRATION: {
      CODE: 1
    },
    PORTAL_VERIFICATION: {
      CODE: 2,
      IMAGE: "YellowBGExclamation",
      MESSAGE: "Your account details are currently being verified. Once complete, you will receive a confirmation on your registered email id. Please log in using the shared link.",
      TITLE: "Company Registration is Pending"
    },
    PORTAL_DASHBOARD: {
      CODE: 4
    },
    PORTAL_ACCESS_REVOKED: {
      CODE: 8,
      IMAGE: "Search",
      MESSAGE: "Your company account access has been revoked for security reasons",
      TITLE: "Access Denied"
    },
    USER_ACCESS_REVOKED: {
      CODE: 16,
      IMAGE: "GreenCircleCheck",
      MESSAGE: "Your account access has been revoked for security reasons",
      TITLE: "Access Denied"
    },
    USER_VERIFICATION: {
      CODE: 32,
      IMAGE: "GreenCircleCheck",
      MESSAGE: "Your account details are currently being verified. Once complete, you will receive a confirmation on your registered email id. Please log in using the shared link.",
      TITLE: "Account verification in progress"
    }
  },

  ROUTES: {
    ROOT_PATH: "/",
    DEFAULT_REDIRECT_PATH_SUPERADMIN: "/user-management/user-list",
    DEFAULT_REDIRECT_PATH_ADMIN: "/brands",
    DEFAULT_REDIRECT_PATH_REPORTER: "/claims",

    ONBOARD: {
      COMPANY_REGISTER: "/onboard/register/company",
      BRAND_REGISTER: "/onboard/register/brand"
    },

    USER_MGMT: {
      USER_LIST: "/user-management/user-list",
      USER_APPROVAL: "/user-management/user-approval"
    },

    BRANDS: {
      BRANDS_LIST: "/brands"
    },

    CLAIMS: {
      CLAIMS_LIST: "/claims"
    },

    PROFILE: {
      USER: "/profile/user-profile"
    }
  },

  NAVIGATION_PANEL: [
    { id: "1", name: "CLAIMS", value: "CLAIMS", href: "/claims", active: false},
    { id: "2", name: "BRANDS", value: "BRANDS", href: "/brands", active: false},
    {
      id: "3",
      name: "USERS",
      value: "USERS",
      href: "users/user-list",
      children: [
        { id: "31", name: "USERLIST", value: "User List", href: "/user-management/user-list", active: true},
        { id: "32", name: "APPROVALLIST", value: "Approval List", href: "/user-management/user-approval", active: false}
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
      ADMIN: "Admininstrator",
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
        SUSPEND: "Suspend User Profile",
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
        SUSPEND: "Suspend Brand",
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
  }
};

export default CONSTANTS;
