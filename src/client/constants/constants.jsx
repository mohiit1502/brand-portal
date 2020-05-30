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
  ]
};

export default CONSTANTS;
