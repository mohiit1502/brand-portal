/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-magic-numbers */
import falcon from "../../components/auth/falcon";
import {CONSTANTS} from "../../constants/server-constants";
import ServerHttp from "../../utility/ServerHttp";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";

const secrets = require(CONSTANTS.PATH);
const ttl = 12 * 60 * 60 * 1000;

class UserManagerApi {

  constructor() {
    const functions = ["checkUnique", "createUser", "deleteUser", "getNewUserBrands", "getNewUserRoles", "getUserInfo", "getUsers", "loginSuccessRedirect", "logout", "register", "reinviteUser", "resetPassword", "updateUser", "updateUserStatus", "updateTouStatus", "contactUs"];
    /* eslint-disable no-return-assign*/
    functions.forEach(name => this[name] = this[name].bind(this));
    this.name = "UserManagerApi";
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        // path: "/ping",
        path: "/health",
        handler: this.checkHealth
      },
      {
        method: "GET",
        path: "/api/falcon/{action}",
        handler: this.redirectToFalcon
      },
      {
        method: "GET",
        path: "/api/userInfo",
        handler: this.getUserInfo
      },
      {
        method: "GET",
        path: "/api/newUser/roles",
        handler: this.getNewUserRoles
      },
      {
        method: "GET",
        path: "/api/newUser/brands",
        handler: this.getNewUserBrands
      },
      {
        method: "GET",
        path: "/api/users",
        handler: this.getUsers
      },
      {
        method: "GET",
        path: "/api/users/checkUnique",
        handler: this.checkUnique
      },
      {
        method: "GET",
        path: "/api/users/getEmailConfig",
        handler: this.getEmailConfig
      },
      {
        method: "POST",
        path: "/api/users",
        handler: this.createUser
      },
      {
        method: "PUT",
        path: "/api/users/{emailId}",
        handler: this.updateUser,
        options: {
          payload: {
            parse: true
          }
        }
      },
      {
        method: "PUT",
        path: "/api/users/{emailId}/status/{status}",
        handler: this.updateUserStatus
      },
      {
        method: "PUT",
        path: "/api/users/updateTouStatus/{status}",
        handler: this.updateTouStatus
      },
      {
        method: "POST",
        path: "/api/users/reinvite",
        handler: this.reinviteUser
      },
      {
        method: "POST",
        path: "/api/users/resetPassword",
        handler: this.resetPassword
      },
      {
        method: "POST",
        path: "/api/users/contactUs",
        handler: this.contactUs
      },
      {
        method: "delete",
        path: "/api/users/{emailId}",
        handler: this.deleteUser,
        options: {
          log: {
            collect: true
          }
        }
      },
      {
        method: "GET",
        path: "/login-redirect",
        handler: this.loginSuccessRedirect
      },
      {
        method: "GET",
        path: "/logout",
        handler: this.logout
      },
      {
        method: "GET",
        path: "/api/logoutProvider",
        handler: this.getLogoutProvider
      }
    ]);

  }

  async checkHealth (request, h) {
    console.log("[UserManagerApi::checkHealth] API request for Check Health has started");
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {headers};
      const HEALTHCHECK_PATH = await ServerUtils.ccmGet(request, "HEALTH_CONFIG.HEALTHCHECK_URL");
      const response = await ServerHttp.get(HEALTHCHECK_PATH, options);
      console.log("[UserManagerApi::checkHealth] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      console.log("[UserManagerApi::checkHealth] API request for check health has completed");
      console.log("[UserManagerApi::checkHealth] Health check response: ", response);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("[UserManagerApi::checkHealth] Error occurred in API request for check health:", err);
      return h.response(err).code(err.status);
    }
  }

  async updateUser (request, h) {
    console.log("[UserManagerApi::updateUser] API request for Update User has started");
    console.log("[UserManagerApi::updateUser] User ID: ", request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/${request.params && request.params.emailId}`
    };
    try {
      const payload = request.payload && request.payload.user;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::checkHealth] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.SELECTED_USER_EMAIL = request.params && request.params.emailId;
      mixpanelPayload.SELECTED_USER_NAME = `${payload && payload.firstName} ${payload && payload.lastName}`;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.put(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::updateUser] API request for Update User has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::updateUser] Error occurred in API request for Update User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_USER, mixpanelPayload);
    }
  }

  async reinviteUser (request, h) {
    console.log("[UserManagerApi::reinviteUser] API request for Reinvite User has started");
    console.log("[UserManagerApi::reinviteUser] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users/reinvite"
    };
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::reinviteUser] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      let INVITE_USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_REINVITE");
      INVITE_USER_PATH && (INVITE_USER_PATH = INVITE_USER_PATH.replace("__email__", request.payload.email));
      const url = `${BASE_URL}${INVITE_USER_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.SELECTED_USER_EMAIL = request.payload && request.payload.email;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::reinviteUser] API request for Reinvite User has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::reinviteUser] Error occurred in API request for Reinvite User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.RESEND_INVITE, mixpanelPayload);
    }
  }

  async resetPassword (request, h) {
    console.log("[UserManagerApi::resetPassword] API request for Reset Password has started");
    console.log("[UserManagerApi::resetPassword] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users/resetPassword"
    };
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      console.log("[UserManagerApi::resetPassword] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      console.log(payload);
      const RESET_PASSWORD_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.RESET_PASSWORD");
      const url = `${BASE_URL}${RESET_PASSWORD_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::resetPassword] API request for Reset Password has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::resetPassword] Error occurred in API request for Reset Password:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.RESET_PASSWORD, mixpanelPayload);
    }
  }

  async getUsers(request, h) {
    console.log("[UserManagerApi::getUsers] API request for get Users has started");
    console.log("[UserManagerApi::getUsers] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/users"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        method: "GET",
        headers
      };
      console.log("[UserManagerApi::getUsers] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getUsers] API request for get Users has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getUsers] Error occurred in API request for get Users:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_USERS, mixpanelPayload);
    }
  }

  async checkUnique(request, h) {
    console.log("[UserManagerApi::checkUnique] API request for Check Unique User has started");
    console.log("[UserManagerApi::checkUnique] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/users/checkUnique"
    };
    try {
      // const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::checkUnique] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      let UNIQUENESS_CHECK_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.UNIQUENESS_CHECK_PATH");
      UNIQUENESS_CHECK_PATH && (UNIQUENESS_CHECK_PATH = UNIQUENESS_CHECK_PATH.replace("__email__", request.query.email));
      // const USER_PATH = `/ropro/umf/v1/users/${request.query.email}/uniqueness`; //request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${UNIQUENESS_CHECK_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.INVITEE_EMAIL = request.query && request.query.email;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      console.log("[UserManagerApi::checkUnique] API request for Check Unique User has completed");
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::checkUnique] Error occurred in API request for Check Unique User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.EMAIL_UNIQUENESS, mixpanelPayload);
    }
  }

  async getEmailConfig(request, h) {
    console.log("[UserManagerApi::getEmailConfig] API request to get user's email configuration has started");
    console.log("[UserManagerApi::getEmailConfig] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/users/getEmailConfig"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::getEmailConfig] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      let EMAIL_CONFIG_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.EMAIL_CONFIG_PATH");
      EMAIL_CONFIG_PATH && (EMAIL_CONFIG_PATH = EMAIL_CONFIG_PATH.replace("__email__", request.query.email));
      const url = `${BASE_URL}${EMAIL_CONFIG_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.EMAIL = request.query && request.query.email;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      console.log("[UserManagerApi::getEmailConfig] API request to get user's email configuration has completed");
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getEmailConfig] Error occurred in API request to get user's email configuration:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_EMAIL_CONFIG, mixpanelPayload);
    }
  }

  // eslint-disable-next-line complexity
  async createUser(request, h) {
    console.log("[UserManagerApi::createUser] API request for Create User has started");
    console.log("[UserManagerApi::createUser] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users"
    };
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };
      console.log("[UserManagerApi::createUser] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.INVITEE_EMAIL = payload && payload.user && payload.user.email;
      mixpanelPayload.INVITEE_NAME =  payload && payload.user && `${payload.user.firstName} ${payload.user.lastName}`;
      mixpanelPayload.INVITEE_ROLE = payload && payload.user && payload.user.role.name;
      mixpanelPayload.INVITEE_ORG_NAME = payload && payload.user && payload.user.organization.name;
      mixpanelPayload.INVITEE_USER_TYPE = payload && payload.user && payload.user.type;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::createUser] API request for Create User has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::createUser] Error occurred in API request for Create User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.CREATE_USER, mixpanelPayload);
    }
  }

  async updateUserStatus (request, h) {
    console.log("[UserManagerApi::updateUserStatus] API request for Update User Status has started");
    console.log("[UserManagerApi::updateUserStatus] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/{emailId}/status/${request.params.status}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::updateUserStatus] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}/status/${request.params.status}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.SELECTED_USER_EMAIL = request.params && request.params.emailId;
      mixpanelPayload.SELECTED_USER_UPDATED_STATUS = request.params && request.params.status;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.put(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::updateUserStatus] API request for Update User Status has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::updateUserStatus] Error occurred in API request for Update User Status:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_USER_STATUS, mixpanelPayload);
    }
  }

  async updateTouStatus (request, h) {
    console.log("[UserManagerApi::updateTouStatus] API request for Update TOU status has started");
    console.log("[UserManagerApi::updateTouStatus] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/updateTouStatus/${request.params && request.params.status}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::updateTouStatus] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const payload = request.payload;
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/me/status/${request.params.status}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.TOU_STATUS = request.params && request.params.status;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.put(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::updateTouStatus] API request for Update TOU status has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::updateTouStatus] Error occurred in API request for Update TOU status:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_TOU_STATUS, mixpanelPayload);
    }
  }

  async deleteUser (request, h) {
    console.log("[UserManagerApi::deleteUser] API request for Delete Userhas started");
    console.log("[UserManagerApi::deleteUser] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers: { ...headers, "Content-Type": "text/plain" }
      };
      console.log("[UserManagerApi::updateTouStatus] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;
      const response = await ServerHttp.delete(url, options);
      console.log("[UserManagerApi::deleteUser] API request for Delete User has completed");
      return h.response(response.body).code(response.status);

    } catch (err) {
      console.log("[UserManagerApi::deleteUser] Error occurred in API request for Delete User:", err);
      return h.response(err).code(err.status);
    }
  }

  async getNewUserRoles (request, h) {
    console.log("[UserManagerApi::getNewUserRoles] API request for New User Roles has started");
    console.log("[UserManagerApi::getNewUserRoles] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/newUser/roles"
    };
    try {
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const ROLE_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.ROLE_PATH");
      const url = `${BASE_URL}${ROLE_PATH}`;
      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      console.log("[UserManagerApi::getNewUserRoles] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getNewUserRoles] API request for New User Roles has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getNewUserRoles] Error occurred in API request for New User Roles:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_NEW_USER_ROLE, mixpanelPayload);
    }
  }

  async getNewUserBrands (request, h) {
    console.log("[UserManagerApi::getNewUserBrands] API request for get New User Brand has started");
    console.log("[UserManagerApi::getNewUserBrands] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/newUser/brands"
    };
    try {
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const ASSIGNABLE_BRANDS_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.ASSIGNABLE_BRANDS_PATH");
      const url = `${BASE_URL}${ASSIGNABLE_BRANDS_PATH}`;

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };
      console.log("[UserManagerApi::getNewUserBrands] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getNewUserBrands] API request for get New User Brand has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getNewUserBrands] Error occurred in API request for get New User Brand:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_NEW_USER_BRAND, mixpanelPayload);
    }
  }


  async getUserInfo (request, h) {
    console.log("[UserManagerApi::getUserInfo] API request for get User information has started");
    console.log("[UserManagerApi::getUserInfo] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/userInfo"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      console.log("[UserManagerApi:getUserInfo Headers: ", headers);
      console.log("[UserManagerApi:getUserInfo Headers: ", request.state);
      const options = {
        headers
      };
      console.log("[UserManagerApi::getUserInfo] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_SELF_INFO_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_SELF_INFO_PATH");
      const url = `${BASE_URL}${USER_SELF_INFO_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getUserInfo] API request for get User information has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getUserInfo] Error occurred in API request for get User information:", err);
      if (err.status === 520) {
        if (err.error.message && err.error.message.indexOf("404") !== -1) {
         return h.response(err).code(404);
        } else {
          return h.response(err).code(err.status);
        }
      }
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_USER_INFORMATION, mixpanelPayload);
    }
  }

  async loginSuccessRedirect (request, h) {
    console.log("[UserManagerApi::loginSuccessRedirect] API request for Redirect of Login Success has started");
    console.log("[UserManagerApi::loginSuccessRedirect] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/login-redirect",
      CLIENT_TYPE: request.query.clientType
    };
    try {
      const query = request.query;
      const clientType = request.query.clientType;
      console.log("Setting clientType post login redirect: ", clientType);
      console.log("Setting clientType post login redirect: ", request.query.auth);
      // eslint-disable-next-line camelcase
      if (!query.code) {
        return h.redirect("/api/falcon/login");
      }
      let response = await this.getAccessToken(request, query.code);
      response = typeof response === "string" ? JSON.parse(response) : response;
      const id_token = response.id_token;
      const user = await ServerUtils.decryptToken(id_token, secrets.IdTokenEncryptionKey);
      const loginId = user.loginId;
      const authToken = user["iam-token"];

      console.log("Before set: ", h.state);
      h.state("auth_session_token", authToken, {ttl, isSecure: false, isHttpOnly: false, path: "/"});
      h.state("session_token_login_id", loginId, {ttl, isSecure: false, isHttpOnly: false, path: "/"});
      h.state("client_type", clientType, {ttl, isSecure: false, isHttpOnly: false, path: "/"});
      console.log("After set: ", h.state);
      mixpanelPayload.distinct_id = loginId;
      mixpanelPayload.API_SUCCESS = true;

      console.log("[UserManagerApi::loginSuccessRedirect] API request for Redirect of Login Success has completed");
      return h.redirect("/");
    } catch (err) {
      console.error("got error in authorization: ", err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      console.log("[UserManagerApi::loginSuccessRedirect] Error occurred in API request for Redirect of Login Success:", err);
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.LOGIN_SUCCESS_REDIRECT, mixpanelPayload);
    }
  }

  async logout(request, h) {
    console.log("[UserManagerApi::logout] API request for Logout has started");
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/logout"
    };
    try {
      h.unstate("auth_session_token");
      h.unstate("session_token_login_id");
      h.unstate("client_type");

      mixpanelPayload.API_SUCCESS = true;
      console.log("[UserManagerApi::logout] API request for Logout has completed");
      return h.redirect("/");
    } catch (err) {
      console.error(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      console.log("[UserManagerApi::logout] Error occurred in API request for Logout:", err);
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.LOGOUT_SUCCESS, mixpanelPayload);
    }
  }

  async getLogoutProvider(request, h) {
    console.log("[UserManagerApi::getLogoutProvider] API request for Get Logout provider has started");
    console.log("[UserManagerApi::getLogoutProvider] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/logoutProvider"
    };
    try {
      let logoutProviderURL = await ServerUtils.ccmGet(request, "IAM.FALCON_LOGOUT_URL");
      logoutProviderURL = logoutProviderURL ? `${logoutProviderURL}&clientId=${secrets.CLIENT_ID}` : logoutProviderURL;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[UserManagerApi::getLogoutProvider] API request for Get Logout provider has completed");
      return h.response(logoutProviderURL).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getLogoutProvider] Error occurred in API request for Get Logout provider:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_LOGOUT_PROVIDER, mixpanelPayload);
    }
  }

  async redirectToFalcon (request, h) {
    console.log("[UserManagerApi::redirectToFalcon] API request for Redirect to Falcon has started");
    console.log("[UserManagerApi::redirectToFalcon] User ID: ", request.state && request.state.session_token_login_id);
    const clientType = request.query.clientType;
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/falcon/{action}",
      CLIENT_TYPE: clientType
    };
    try {
      // if (!clientType) {
      //   return h.redirect(`/${request.params.action}`)
      // }
      const redirectUri = await falcon.generateFalconRedirectURL(request, request.params.action, clientType);
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.REDIRECT_URI = redirectUri;
      console.log("[UserManagerApi::redirectToFalcon] API request for Redirect to Falcon has completed");
      return h.redirect(redirectUri);
    } catch (e) {
      console.log("[UserManagerApi::redirectToFalcon] Error occurred in API request for Redirect to Falcon:", e);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = e;
      throw e;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.REDIRECT_TO_FALCON, mixpanelPayload);
    }
  }

  async getAccessToken(request, authorizationCode) {
    console.log("[UserManagerApi::getAccessToken] API request for Get Access Token has started");
    console.log("[UserManagerApi::getAccessToken] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {};
    try {
      const IAM = await ServerUtils.ccmGet(request, "IAM");
      const url = secrets.IAM_TOKEN_URL;
      const clientId = secrets.CLIENT_ID;
      const clientSecret = secrets.CLIENT_SECRET;
      const encoding = secrets.ENCODING;
      const payload =   {
        code: authorizationCode,
        redirect_uri: `${process.env.NODE_ENV === "development" ? CONSTANTS.BASE_URL : IAM.BASE_URL}${IAM.REDIRECT_PATH}`,
        // redirect_uri: IAM.BASE_URL + IAM.REDIRECT_PATH,
        grant_type: secrets.GRANT_TYPE
      };

      const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString(encoding);
      const headers = {
        Authorization: `Basic ${base64}`,
        "WM_SVC.ENV": secrets["WM_SVC.ENV"],
        "WM_CONSUMER.ID": secrets["WM_CONSUMER.ID"],
        "WM_QOS.CORRELATION_ID": ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH).toUpperCase(),
        "WM_SVC.NAME": secrets["WM_SVC.NAME"],
        "WM_SVC.VERSION": secrets["WM_SVC.VERSION"],
        "WM_CONSUMER.NAME": secrets["WM_CONSUMER.NAME"]
      };
      const options = {headers};
      const response = await ServerHttp.post(url, options, payload); //fetchJSON(url, options);
      console.log("[UserManagerApi::getAccessToken] API request for Get Access Token has completed");
      mixpanelPayload.URL = url;
      mixpanelPayload.METHOD = "POST";
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.RESPONSE_STATUS = response && response.status;
      return response.body;

    } catch (err) {
      console.log("[UserManagerApi::getAccessToken] Error occurred in API request for Get Access Token:", err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err && err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err && err.status;
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_ACCESS_TOKEN, mixpanelPayload);
    }
  }

  async contactUs(request, h) {
    console.log("[UserManagerApi::contactUs] API Request to send an email for support");
    console.log("[UserManagerApi::contactUs] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users/contactUs"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      console.log("[UserManagerApi::contactUs] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const payload = request.payload;
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_CONTACT_US_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.CONTACT_US_ENDPOINT");
      const url = `${BASE_URL}${USER_CONTACT_US_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::contactUs] API request for to send support mail has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::contactUs] API request for to send support mail failed");
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.CONTACT_US, mixpanelPayload);
    }
  }

}

export default new UserManagerApi();
