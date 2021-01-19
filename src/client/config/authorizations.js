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
        }
    },
    BRANDS: {
        SECTION_ACCESS: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER],
        SHOW_OPTIONS: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED, CONSTANTS.BRAND.STATUS.SUSPENDED]
        },
        CREATE: [ROLES.SUPERADMIN, ROLES.ADMIN],
        EDIT: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED]
        },
        DELETE: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED, CONSTANTS.BRAND.STATUS.SUSPENDED, CONSTANTS.BRAND.STATUS.PENDING]
        },
        SUSPEND: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.STATUS.VERIFIED]
        },
        REACTIVATE: {
            ROLES: [ROLES.SUPERADMIN, ROLES.ADMIN],
            STATUS: [CONSTANTS.BRAND.STATUS.SUSPENDED]
        }
    },
    CLAIMS: {
        SECTION_ACCESS: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER],
        RAISE: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REPORTER]
    },
    USERLIST: {

    },
    APPROVALLIST: {

    }
};

export default CONFIG;
