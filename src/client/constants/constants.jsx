const CONSTANTS = {
  ROUTES: {
    ROOT_PATH: "/",
    DEFAULT_REDIRECT_PATH: "/user-management/user-list",

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
      ADMIN: "Admin",
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
