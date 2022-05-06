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
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {headers};
      console.log("[Corr ID: %s][UserManagerApi::checkHealth] Initiating Health Check", corrId);
      const HEALTHCHECK_PATH = await ServerUtils.ccmGet(request, "HEALTH_CONFIG.HEALTHCHECK_URL");
      const response = await ServerHttp.get(HEALTHCHECK_PATH, options);
      console.log("[Corr ID: %s][UserManagerApi::checkHealth] API request for check health has completed");
      console.log("[Corr ID: %s][UserManagerApi::checkHealth] Health check response: ", corrId, response);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.error("[Corr ID: %s][UserManagerApi::checkHealth] Error occurred in API request for check health:", corrId, err);
      return h.response(err).code(err.status);
    }
  }

  async updateUser (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::updateUser] Initiating API request for Update User", corrId);
    console.log("[Corr ID: %s][UserManagerApi::updateUser] User ID: ", corrId, request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/${request.params && request.params.emailId}`
    };
    try {
      const payload = request.payload && request.payload.user;
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::checkHealth] Fetching dependencies from CCM", corrId);
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

      console.log("[Corr ID: %s][UserManagerApi::checkHealth] Calling ServerHttp.put", corrId);
      const response = await ServerHttp.put(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][UserManagerApi::updateUser] API request for Update User has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::updateUser] Error occurred in API request for Update User:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_USER, mixpanelPayload);
    }
  }

  async reinviteUser (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::reinviteUser] API request for Reinvite User has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::reinviteUser] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users/reinvite"
    };
    try {
      const payload = request.payload;
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::reinviteUser] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::reinviteUser] Initiating API call", corrId);
      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][UserManagerApi::reinviteUser] API request for Reinvite User has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::reinviteUser] Error occurred in API request for Reinvite User: ", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.RESEND_INVITE, mixpanelPayload);
    }
  }

  async resetPassword (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::resetPassword] API request for Reset Password has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::resetPassword] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users/resetPassword"
    };
    try {
      const payload = request.payload;
      const options = {
        headers
      };

      console.log("[Corr ID: %s][UserManagerApi::resetPassword] Fetching dependencies from CCM", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const RESET_PASSWORD_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.RESET_PASSWORD");
      const url = `${BASE_URL}${RESET_PASSWORD_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;
      console.log("[Corr ID: %s][UserManagerApi::resetPassword] Initiating API call", corrId);
      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][UserManagerApi::resetPassword] API request for Reset Password has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::resetPassword] Error occurred in API request for Reset Password:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.RESET_PASSWORD, mixpanelPayload);
    }
  }

  async getUsers(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::getUsers] API request for get Users has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getUsers] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/users"
    };
    try {
      const options = {
        method: "GET",
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::getUsers] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::getUsers] API request for get Users has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::getUsers] Error occurred in API request for get Users:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_USERS, mixpanelPayload);
    }
  }

  async checkUnique(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::checkUnique] API request for Check Unique User has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::checkUnique] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/users/checkUnique"
    };
    try {
      // const payload = request.payload;
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::checkUnique] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::checkUnique] API request for Check Unique User has completed", corrId);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::checkUnique] Error occurred in API request for Check Unique User:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.EMAIL_UNIQUENESS, mixpanelPayload);
    }
  }

  async getEmailConfig(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::getEmailConfig] API request to get user's email configuration has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getEmailConfig] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/users/getEmailConfig"
    };
    try {
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::getEmailConfig] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::getEmailConfig] API request to get user's email configuration has completed", corrId);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::getEmailConfig] Error occurred in API request to get user's email configuration:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_EMAIL_CONFIG, mixpanelPayload);
    }
  }

  // eslint-disable-next-line complexity
  async createUser(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::createUser] API request for Create User has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::createUser] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users"
    };
    try {
      const payload = request.payload;
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::createUser] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::createUser] API request for Create User has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::createUser] Error occurred in API request for Create User:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.CREATE_USER, mixpanelPayload);
    }
  }

  async updateUserStatus (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::updateUserStatus] API request for Update User Status has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::updateUserStatus] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/{emailId}/status/${request.params.status}`
    };
    try {
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::updateUserStatus] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::updateUserStatus] API request for Update User Status has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::updateUserStatus] Error occurred in API request for Update User Status:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_USER_STATUS, mixpanelPayload);
    }
  }

  async updateTouStatus (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::updateTouStatus] API request for Update TOU status has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::updateTouStatus] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/updateTouStatus/${request.params && request.params.status}`
    };
    try {
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::updateTouStatus] Fetching dependencies from CCM", corrId);
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
      console.log("[Corr ID: %s][UserManagerApi::updateTouStatus] API request for Update TOU status has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::updateTouStatus] Error occurred in API request for Update TOU status:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_TOU_STATUS, mixpanelPayload);
    }
  }

  async deleteUser (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::deleteUser] API request for Delete Userhas started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::deleteUser] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    try {
      const options = {
        headers: { ...headers, "Content-Type": "text/plain" }
      };
      console.log("[Corr ID: %s][UserManagerApi::deleteUser] Fetching dependencies from CCM", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;
      const response = await ServerHttp.delete(url, options);
      console.log("[Corr ID: %s][UserManagerApi::deleteUser] API request for Delete User has completed", corrId);
      return h.response(response.body).code(response.status);

    } catch (err) {
      console.error("[Corr ID: %s][UserManagerApi::deleteUser] Error occurred in API request for Delete User:", corrId, err);
      return h.response(err).code(err.status);
    }
  }

  async getNewUserRoles (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::getNewUserRoles] API request for New User Roles has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getNewUserRoles] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/newUser/roles"
    };
    try {
      console.log("[Corr ID: %s][UserManagerApi::getNewUserRoles] Fetching dependencies from CCM", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const ROLE_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.ROLE_PATH");
      const url = `${BASE_URL}${ROLE_PATH}`;

      const options = {
        headers
      };

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][UserManagerApi::getNewUserRoles] API request for New User Roles has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::getNewUserRoles] Error occurred in API request for New User Roles:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_NEW_USER_ROLE, mixpanelPayload);
    }
  }

  async getNewUserBrands (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::getNewUserBrands] API request for get New User Brand has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getNewUserBrands] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/newUser/brands"
    };
    try {
      console.log("[Corr ID: %s][UserManagerApi::getNewUserBrands] Fetching dependencies from CCM", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const ASSIGNABLE_BRANDS_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.ASSIGNABLE_BRANDS_PATH");
      const url = `${BASE_URL}${ASSIGNABLE_BRANDS_PATH}`;


      const options = {
        headers
      };
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][UserManagerApi::getNewUserBrands] API request for get New User Brand has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::getNewUserBrands] Error occurred in API request for get New User Brand:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_NEW_USER_BRAND, mixpanelPayload);
    }
  }


  async getUserInfo (request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::getUserInfo] API request for get User information has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getUserInfo] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/userInfo"
    };
    try {
      headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      const options = {
        headers
      };
      console.log("[Corr ID: %s][UserManagerApi::getUserInfo] Fetching dependencies from CCM", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_SELF_INFO_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_SELF_INFO_PATH");
      const url = `${BASE_URL}${USER_SELF_INFO_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = corrId;
      mixpanelPayload.CLIENT_TYPE = headers.ROPRO_CLIENT_TYPE;
      console.log("[Corr ID: %s][UserManagerApi:getUserInfo] Initiating get request", corrId);
      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      if (headers.ROPRO_CLIENT_TYPE === "seller") {
        const country = response.body.sellerInfo && response.body.sellerInfo.organizationAddress.country;
        mixpanelPayload.COUNTRY = country;
        if (country && ["US", "USA", "United States", "CN", "HK", "IN"].indexOf(country) === -1) {
          mixpanelPayload.USER_BLOCKED = true;
          console.log("[Corr ID: %s][UserManagerApi::getUserInfo][Country: %s][Email: %s] Unsupported seller's country, blocking the user",
            corrId, country, request.state && request.state.bp_session_token_login_id)
        }
      }
      console.log("[Corr ID: %s][UserManagerApi::getUserInfo] API request for get User information has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::getUserInfo] Error occurred in API request for get User information:", corrId, err);
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
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] API request for Redirect of Login Success has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/login-redirect",
      CLIENT_TYPE: request.query.clientType
    };
    try {
      const query = request.query;
      const clientType = request.query.clientType;
      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Setting clientType post login redirect: ", corrId, clientType);
      // eslint-disable-next-line camelcase
      if (!query.code) {
        console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect][Client Type: %s] No code found on loginSuccessRedirect, possible redirect after password reset", corrId, clientType)
        return h.redirect(clientType ? `/api/falcon/login?clientType=${clientType}` : "/api/falcon/login");
      }
      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Requesting access token from IAM", corrId);
      let response = await this.getAccessToken(request, query.code);
      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Received access token from IAM, initiate token decrypt", corrId);
      response = typeof response === "string" ? JSON.parse(response) : response;
      const id_token = response.id_token;
      const user = await ServerUtils.decryptToken(id_token, secrets.IdTokenEncryptionKey);
      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Decrypted access token", corrId);
      const loginId = user.loginId;
      const authToken = user["iam-token"];

      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Setting session token, login ID and client type cookies: ", corrId, h.state);
      h.state("bp_auth_session_token", authToken, {ttl, isSecure: false, isHttpOnly: false, path: "/"});
      h.state("bp_session_token_login_id", loginId, {ttl, isSecure: false, isHttpOnly: false, path: "/"});
      h.state("bp_client_type", clientType, {ttl, isSecure: false, isHttpOnly: false, path: "/"});
      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Done setting session token, login ID and client type cookies: ", corrId, h.state);
      mixpanelPayload.distinct_id = loginId;
      mixpanelPayload.API_SUCCESS = true;

      console.log("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] API request for Redirect of Login Success has completed", corrId);
      return h.redirect("/");
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      console.error("[Corr ID: %s][UserManagerApi::loginSuccessRedirect] Error occurred in API request for Redirect of Login Success:", corrId, err);
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.LOGIN_SUCCESS_REDIRECT, mixpanelPayload);
    }
  }

  async logout(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][UserManagerApi::logout] API request for Logout has started", corrId);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/logout"
    };
    try {
      console.log("[Corr ID: %s][UserManagerApi::logout] Clearing cookies", corrId);
      h.unstate("bp_auth_session_token");
      h.unstate("bp_session_token_login_id");
      h.unstate("bp_client_type");
      console.log("[Corr ID: %s][UserManagerApi::logout] Cookies have been cleared", corrId);

      mixpanelPayload.API_SUCCESS = true;
      console.log("[Corr ID: %s][UserManagerApi::logout] API request for Logout has completed", corrId);
      return h.redirect("/");
    } catch (err) {
      console.error(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      console.error("[Corr ID: %s][UserManagerApi::logout] Error occurred in API request for Logout:", corrId, err);
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.LOGOUT_SUCCESS, mixpanelPayload);
    }
  }

  async getLogoutProvider(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][UserManagerApi::getLogoutProvider] API request for Get Logout provider has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getLogoutProvider] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/logoutProvider"
    };
    try {
      console.log("[Corr ID: %s][UserManagerApi::getLogoutProvider] Fetching dependencies from CCM", corrId);
      let logoutProviderURL = await ServerUtils.ccmGet(request, "IAM.FALCON_LOGOUT_URL");
      logoutProviderURL = logoutProviderURL ? `${logoutProviderURL}&clientId=${secrets.CLIENT_ID}` : logoutProviderURL;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.distinct_id = request.state && request.state.bp_session_token_login_id;
      console.log("[Corr ID: %s][UserManagerApi::getLogoutProvider] API request for Get Logout provider has completed", corrId);
      return h.response(logoutProviderURL).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::getLogoutProvider] Error occurred in API request for Get Logout provider:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_LOGOUT_PROVIDER, mixpanelPayload);
    }
  }

  async redirectToFalcon (request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][UserManagerApi::redirectToFalcon] API request for Redirect to Falcon has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::redirectToFalcon] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const clientType = request.query.clientType;
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/falcon/{action}",
      CLIENT_TYPE: clientType
    };
    try {
      console.log("[Corr ID: %s][UserManagerApi::redirectToFalcon] Initiating Generate Falcon's Redirect URL", corrId)
      const redirectUri = await falcon.generateFalconRedirectURL(request, request.params.action, clientType);
      console.log("[Corr ID: %s][UserManagerApi::redirectToFalcon] Generated Falcon's Redirect URL: ", corrId, redirectUri);
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.REDIRECT_URI = redirectUri;
      console.log("[Corr ID: %s][UserManagerApi::redirectToFalcon] Redirecting to Falcon now!", corrId);
      return h.redirect(redirectUri);
    } catch (e) {
      console.error("[Corr ID: %s][UserManagerApi::redirectToFalcon] Error occurred in API request for Redirect to Falcon: ", corrId, e);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = e;
      throw e;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.REDIRECT_TO_FALCON, mixpanelPayload);
    }
  }

  async getAccessToken(request, authorizationCode) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH).toUpperCase();
    console.log("[Corr ID: %s][UserManagerApi::getAccessToken] API request for Get Access Token has started", corrId);
    console.log("[Corr ID: %s][UserManagerApi::getAccessToken] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {};
    try {
      console.log("[Corr ID: %s][UserManagerApi::getAccessToken] Fetching dependencies from CCM", corrId)
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
        "WM_QOS.CORRELATION_ID": corrId,
        "WM_SVC.NAME": secrets["WM_SVC.NAME"],
        "WM_SVC.VERSION": secrets["WM_SVC.VERSION"],
        "WM_CONSUMER.NAME": secrets["WM_CONSUMER.NAME"]
      };
      const options = {headers};
      console.log("[Corr ID: %s][%s][UserManagerApi::getAccessToken] Calling IAM via ServerHttp.post", corrId, url);
      const response = await ServerHttp.post(url, options, payload); //fetchJSON(url, options);
      console.log("[Corr ID: %s][UserManagerApi::getAccessToken] API request for Get Access Token has completed", corrId);
      mixpanelPayload.URL = url;
      mixpanelPayload.METHOD = "POST";
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.RESPONSE_STATUS = response && response.status;
      return response.body;
    } catch (err) {
      console.error("[Corr ID: %s][UserManagerApi::getAccessToken] Error occurred in API request for Get Access Token: ", corrId, err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err && err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err && err.status;
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_ACCESS_TOKEN, mixpanelPayload);
    }
  }

  async contactUs(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][UserManagerApi::contactUs] API Request to send an email for support", corrId);
    console.log("[Corr ID: %s][UserManagerApi::contactUs] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users/contactUs"
    };
    try {
      const options = {
        headers
      };
      const payload = request.payload;
      console.log("[Corr ID: %s][UserManagerApi::updateTouStatus] Fetching dependencies from CCM", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_CONTACT_US_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.CONTACT_US_ENDPOINT");
      const url = `${BASE_URL}${USER_CONTACT_US_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][UserManagerApi::contactUs] API request for to send support mail has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][UserManagerApi::contactUs] API request for to send support mail failed", corrId);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.CONTACT_US, mixpanelPayload);
    }
  }

}

export default new UserManagerApi();
