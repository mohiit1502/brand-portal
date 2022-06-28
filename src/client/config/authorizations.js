import CONSTANTS from "../constants/constants";
const ROLES = CONSTANTS.USER.ROLES;
const CONFIG = {
    USERS: {
        SECTION_ACCESS: [ROLES.SUPERADMIN, ROLES.ADMIN],
        SHOW_OPTIONS: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.USER.STATUS.ACTIVE, CONSTANTS.USER.OPTIONS.PAYLOAD.SUSPEND, CONSTANTS.USER.STATUS.PENDING]
        },
        INVITE: {
            [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.REPORTER],
            [ROLES.ADMIN]: [ROLES.REPORTER],
            STATUS: [CONSTANTS.USER.STATUS.ACTIVE]
        },
        EDIT: {
            [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.REPORTER],
            [ROLES.ADMIN]: [ROLES.REPORTER],
            STATUS: [CONSTANTS.USER.STATUS.ACTIVE]
        },
        SUSPEND: {
            [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.REPORTER],
            [ROLES.ADMIN]: [ROLES.REPORTER],
            STATUS: [CONSTANTS.USER.STATUS.ACTIVE]
        },
        REACTIVATE: {
            [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.REPORTER],
            [ROLES.ADMIN]: [ROLES.REPORTER],
            STATUS: [CONSTANTS.USER.OPTIONS.PAYLOAD.SUSPEND]
        },
        DELETE: {
            [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.REPORTER],
            [ROLES.ADMIN]: [ROLES.REPORTER]
        },
        REINVITE: {
            [ROLES.SUPERADMIN]: [ROLES.ADMIN, ROLES.REPORTER],
            [ROLES.ADMIN]: [ROLES.REPORTER],
            STATUS: [CONSTANTS.USER.STATUS.PENDING]
        },
        DASHBOARD_ACTION: [ROLES.SUPERADMIN, ROLES.ADMIN]
    },
    BRANDS: {
        SECTION_ACCESS: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER],
        SHOW_PARENT_OPTIONS: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            // STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED, CONSTANTS.BRAND.STATUS.SUSPENDED]
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED, CONSTANTS.BRAND.STATUS.SUSPENDED, CONSTANTS.BRAND.STATUS.PENDING]
        },
        SHOW_CHILD_OPTIONS: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            // STATUS: [CONSTANTS.BRAND.TRADEMARK.STATUS.VERIFIED, CONSTANTS.BRAND.TRADEMARK.STATUS.SUSPENDED]
            STATUS: [CONSTANTS.BRAND.TRADEMARK.STATUS.VERIFIED, CONSTANTS.BRAND.TRADEMARK.STATUS.SUSPENDED, CONSTANTS.BRAND.TRADEMARK.STATUS.PENDING]
        },
        CREATE: [ROLES.SUPERADMIN, ROLES.ADMIN],
        EDIT: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            // STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED],
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED, CONSTANTS.BRAND.STATUS.PENDING],
            DEPENDENCY: "brandStatus"
        },
        ADD: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED, CONSTANTS.BRAND.STATUS.SUSPENDED, CONSTANTS.BRAND.STATUS.PENDING],
            DEPENDENCY: "brandStatus"
        },
        EDITCHILD: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            // STATUS: [CONSTANTS.BRAND.TRADEMARK.STATUS.VERIFIED],
            STATUS: [CONSTANTS.BRAND.TRADEMARK.STATUS.VERIFIED, CONSTANTS.BRAND.TRADEMARK.STATUS.PENDING],
            DEPENDENCY: "trademarkStatus"
        },
        DEACTIVATECHILD: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.TRADEMARK.STATUS.VERIFIED],
            // STATUS: [CONSTANTS.BRAND.TRADEMARK.STATUS.VERIFIED, CONSTANTS.BRAND.TRADEMARK.STATUS.PENDING],
            DEPENDENCY: "trademarkStatus"
        },
        DASHBOARD_ACTION: [ROLES.SUPERADMIN, ROLES.ADMIN]
    },
    CLAIMS: {
        SECTION_ACCESS: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER],
        RAISE: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER],
        DASHBOARD_ACTION: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER]
    },
    USERLIST: {

    },
    APPROVALLIST: {

    }
};

export default CONFIG;
