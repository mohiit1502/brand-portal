/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
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
    const functions = ["checkUnique", "createUser", "deleteUser", "getNewUserBrands", "getNewUserRoles", "getUserInfo", "getUsers", "loginSuccessRedirect", "logout", "register", "reinviteUser", "resetPassword", "updateUser", "updateUserStatus", "updateTouStatus"]
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
      console.log("[UserManagerApi::checkHealth] API request for check health has completed");
      console.log("[UserManagerApi::checkHealth] Health check response: ", response);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("[UserManagerApi::checkHealth] Error occured in API request for check health:", err);
      return h.response(err).code(err.status);
    }
  }

  async updateUser (request, h) {
    console.log("[UserManagerApi::updateUser] API request for Update User has started");
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/${request.params.emailId}`
    };
    try {
      const payload = request.payload.user;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.SELECTED_USER_EMAIL = request.params.emailId;
      mixpanelPayload.SELECTED_USER_NAME = `${payload.firstName} ${payload.lastName}`;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.put(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::updateUser] API request for Update User has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::updateUser] Error occured in API request for Update User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_USER, mixpanelPayload);
    }
  }

  async reinviteUser (request, h) {
    console.log("[UserManagerApi::reinviteUser] API request for Reinvite User has started");
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
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      let INVITE_USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_REINVITE");
      INVITE_USER_PATH && (INVITE_USER_PATH = INVITE_USER_PATH.replace("__email__", request.payload.email));
      const url = `${BASE_URL}${INVITE_USER_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.SELECTED_USER_EMAIL = request.payload.email;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::reinviteUser] API request for Reinvite User has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::reinviteUser] Error occured in API request for Reinvite User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.RESEND_INVITE, mixpanelPayload);
    }
  }

  async resetPassword (request, h) {
    console.log("[UserManagerApi::resetPassword] API request for Reset Password has started");
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

      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      console.log(payload);
      let RESET_PASSWORD_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.RESET_PASSWORD");
      const url = `${BASE_URL}${RESET_PASSWORD_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::resetPassword] API request for Reset Password has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::resetPassword] Error occured in API request for Reset Password:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.RESET_PASSWORD, mixpanelPayload);
    }
  }

  async getUsers(request, h) {
    console.log("[UserManagerApi::getUsers] API request for get Users has started");
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
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getUsers] API request for get Users has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getUsers] Error occured in API request for get Users:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_USERS, mixpanelPayload);
    }
  }

  async checkUnique(request, h) {
    console.log("[UserManagerApi::checkUnique] API request for Check Unique User has started");
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
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      let UNIQUENESS_CHECK_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.UNIQUENESS_CHECK_PATH");
      UNIQUENESS_CHECK_PATH && (UNIQUENESS_CHECK_PATH = UNIQUENESS_CHECK_PATH.replace("__email__", request.query.email));
      // const USER_PATH = `/ropro/umf/v1/users/${request.query.email}/uniqueness`; //request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${UNIQUENESS_CHECK_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.INVITEE_EMAIL = request.query.email;

      const response = await ServerHttp.get(url, options);
      console.log("[UserManagerApi::checkUnique] API request for Check Unique User has completed");
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::checkUnique] Error occured in API request for Check Unique User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.EMAIL_UNIQUENESS, mixpanelPayload);
    }
  }

  async createUser(request, h) {
    console.log("[UserManagerApi::createUser] API request for Create User has started");
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/users"
    };
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.INVITEE_EMAIL = payload.user.email;
      mixpanelPayload.INVITEE_NAME = `${payload.user.firstName} ${payload.user.lastName}`;
      mixpanelPayload.INVITEE_ROLE = payload.user.role.name;
      mixpanelPayload.INVITEE_ORG_NAME = payload.user.organization.name;
      mixpanelPayload.INVITEE_USER_TYPE = payload.user.type;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::createUser] API request for Create User has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::createUser] Error occured in API request for Create User:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.CREATE_USER, mixpanelPayload);
    }
  }

  async updateUserStatus (request, h) {
    console.log("[UserManagerApi::updateUserStatus] API request for Update User Status has started");
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/{emailId}/status/${request.params.status}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}/status/${request.params.status}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.SELECTED_USER_EMAIL = request.params.emailId;
      mixpanelPayload.SELECTED_USER_UPDATED_STATUS = request.params.status;

      const response = await ServerHttp.put(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::updateUserStatus] API request for Update User Status has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::updateUserStatus] Error occured in API request for Update User Status:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_USER_STATUS, mixpanelPayload);
    }
  }

  async updateTouStatus (request, h) {
    console.log("[UserManagerApi::updateTouStatus] API request for Update TOU status has started");
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/users/updateTouStatus/${request.params.status}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const payload = request.payload;
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8091";
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/me/status/${request.params.status}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.TOU_STATUS = request.params.status;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.put(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::updateTouStatus] API request for Update TOU status has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::updateTouStatus] Error occured in API request for Update TOU status:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.UPDATE_TOU_STATUS, mixpanelPayload);
    }
  }

  async deleteUser (request, h) {
    console.log("[UserManagerApi::deleteUser] API request for Delete Userhas started");
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers: { ...headers, "Content-Type": "text/plain" }
      };
      const BASE_URL = await ServerUtils.ccmGet(request, "USER_CONFIG.BASE_URL");
      const USER_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;
      const response = await ServerHttp.delete(url, options);
      console.log("[UserManagerApi::deleteUser] API request for Delete User has completed");
      return h.response(response.body).code(response.status);

    } catch (err) {
      console.log("[UserManagerApi::deleteUser] Error occured in API request for Delete User:", err);
      return h.response(err).code(err.status);
    }
  }

  async getNewUserRoles (request, h) {
    console.log("[UserManagerApi::getNewUserRoles] API request for New User Roles has started");
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

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getNewUserRoles] API request for New User Roles has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getNewUserRoles] Error occured in API request for New User Roles:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_NEW_USER_ROLE, mixpanelPayload);
    }
  }

  async getNewUserBrands (request, h) {
    console.log("[UserManagerApi::getNewUserBrands] API request for get New User Brand has started");
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
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getNewUserBrands] API request for get New User Brand has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getNewUserBrands] Error occured in API request for get New User Brand:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_NEW_USER_BRAND, mixpanelPayload);
    }
  }


  async getUserInfo (request, h) {
    console.log("[UserManagerApi::getUserInfo] API request for get User information has started");
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/userInfo"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = await ServerUtils.ccmGet(request,"USER_CONFIG.BASE_URL");
      const USER_SELF_INFO_PATH = await ServerUtils.ccmGet(request, "USER_CONFIG.USER_SELF_INFO_PATH");
      const url = `${BASE_URL}${USER_SELF_INFO_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[UserManagerApi::getUserInfo] API request for get User information has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      if (err.status === 520) {
        if (err.error && err.error.message) {
          const iamResponse = JSON.parse(err.error.message);
          return iamResponse && iamResponse.code === "1052" && h.response(err).code(404);
        } else {
          return h.response(err).code(err.status);
        }
      }
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getUserInfo] Error occured in API request for get User information:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_USER_INFORMATION, mixpanelPayload);
    }
  }

  async loginSuccessRedirect (request, h) {
    console.log("[UserManagerApi::loginSuccessRedirect] API request for Redirect of Login Success has started");
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/login-redirect"
    };
    try {
      const query = request.query;
      // eslint-disable-next-line camelcase
      if (!query.code) {
        return h.redirect("/api/falcon/login");
      }
      const {id_token} = await this.getAccessToken(request, query.code);
      const user = await ServerUtils.decryptToken(id_token, secrets.IdTokenEncryptionKey);
      // const user = await ServerUtils.decryptToken(id_token);
      const loginId = user.loginId;
      const authToken = user["iam-token"];

      h.state("auth_session_token", authToken, {ttl, isSecure: false, isHttpOnly: false});
      h.state("session_token_login_id", loginId, {ttl, isSecure: false, isHttpOnly: false});

      mixpanelPayload.distinct_id = loginId;
      mixpanelPayload.Email = loginId;
      mixpanelPayload.API_SUCCESS = true;

      console.log("[UserManagerApi::loginSuccessRedirect] API request for Redirect of Login Success has completed");
      return h.redirect("/");
    } catch (err) {
      console.error("got error in authorization: ", err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      console.log("[UserManagerApi::loginSuccessRedirect] Error occured in API request for Redirect of Login Success:", err);
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
      // h.unstate("auth_session_token");
      h.state("auth_session_token", "", {
        ttl: 1,
        isSecure: false,
        isHttpOnly: false
      });
      h.state("session_token_login_id", "", {
        ttl: 1,
        isSecure: false,
        isHttpOnly: false
      });

      mixpanelPayload.API_SUCCESS = true;
      console.log("[UserManagerApi::logout] API request for Logout has completed");
      return h.redirect("/");
    } catch (err) {
      console.error(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      console.log("[UserManagerApi::logout] Error occured in API request for Logout:", err);
      throw err;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.LOGOUT_SUCCESS, mixpanelPayload);
    }
  }

  async getLogoutProvider(request, h) {
    console.log("[UserManagerApi::getLogoutProvider] API request for Get Logout provider has started");
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/logoutProvider"
    };
    try {
      let logoutProviderURL = await ServerUtils.ccmGet(request, "IAM.FALCON_LOGOUT_URL");
      logoutProviderURL = logoutProviderURL ? `${logoutProviderURL}&clientId=${secrets.CLIENT_ID}` : logoutProviderURL;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      console.log("[UserManagerApi::getLogoutProvider] API request for Get Logout provider has completed");
      return h.response(logoutProviderURL).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[UserManagerApi::getLogoutProvider] Error occured in API request for Get Logout provider:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_API.GET_LOGOUT_PROVIDER, mixpanelPayload);
    }
  }

  async redirectToFalcon (request, h) {
    console.log("[UserManagerApi::redirectToFalcon] API request for Redirect to Falcon has started");
    try {
      const redirectUri = await falcon.generateFalconRedirectURL(request, request.params.action);
      console.log("[UserManagerApi::redirectToFalcon] API request for Redirect to Falcon has completed");
      return h.redirect(redirectUri);
    } catch (e) {
      console.log("[UserManagerApi::redirectToFalcon] Error occured in API request for Redirect to Falcon:", e);
      throw e;
    }
  }

  async getAccessToken(request, authorizationCode) {
    console.log("[UserManagerApi::getAccessToken] API request for Get Access Token has started");
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
      return response.body;

    } catch (err) {
      console.log("[UserManagerApi::getAccessToken] Error occured in API request for Get Access Token:", err);
      throw err;
    }
  }


}

export default new UserManagerApi();
