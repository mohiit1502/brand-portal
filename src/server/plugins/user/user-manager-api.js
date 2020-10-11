/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import falcon from "../../components/auth/falcon";
import {CONSTANTS} from "../../constants/server-constants";
import ServerHttp from "../../utility/ServerHttp";
import ServerUtils from "../../utility/server-utils";

const secrets = require(CONSTANTS.PATH);
const ttl = 12 * 60 * 60 * 1000;

class UserManagerApi {

  constructor() {
    const functions = ["checkUnique", "createUser", "deleteUser", "getNewUserBrands", "getNewUserRoles", "getUserInfo", "getUsers", "loginSuccessRedirect", "logout", "register", "reinviteUser", "resetPassword", "updateUser", "updateUserStatus"]
    functions.forEach(name => this[name] = this[name].bind(this));
    this.name = "UserManagerApi";
  }

  createBody(result) {
    let retObj = {};
    if (result && result.response && !isEmpty(result)) {
      const res = get(result, "response.data");
      const OK = 200;
      const BAD_REQUEST = 400;

      retObj = {
        status: res ? OK : BAD_REQUEST,
        payload: res || get(result, "response.errors")
      };
    } else {
      retObj = {
        status: get(result, "error.status"),
        payload: get(result, "error.response")
      };
    }
    return retObj;
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
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {headers};
      const HEALTHCHECK_PATH = request.app.ccmGet("HEALTH_CONFIG.HEALTHCHECK_URL");
      const response = await ServerHttp.get(HEALTHCHECK_PATH, options);
      console.log("Health check response: ", response);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async updateUser (request, h) {
    try {
      const payload = request.payload.user;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_PATH = request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;

      const response = await ServerHttp.put(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async reinviteUser (request, h) {
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      let INVITE_USER_PATH = request.app.ccmGet("USER_CONFIG.USER_REINVITE");
      INVITE_USER_PATH && (INVITE_USER_PATH = INVITE_USER_PATH.replace("__email__", request.payload.email));
      const url = `${BASE_URL}${INVITE_USER_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async resetPassword (request, h) {
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      console.log(payload);
      let RESET_PASSWORD_PATH = request.app.ccmGet("USER_CONFIG.RESET_PASSWORD");
      const url = `${BASE_URL}${RESET_PASSWORD_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async getUsers(request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        method: "GET",
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_PATH = request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async checkUnique(request, h) {
    try {
      // const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      let UNIQUENESS_CHECK_PATH = request.app.ccmGet("USER_CONFIG.UNIQUENESS_CHECK_PATH");
      UNIQUENESS_CHECK_PATH && (UNIQUENESS_CHECK_PATH = UNIQUENESS_CHECK_PATH.replace("__email__", request.query.email));
      // const USER_PATH = `/ropro/umf/v1/users/${request.query.email}/uniqueness`; //request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${UNIQUENESS_CHECK_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async createUser(request, h) {
    try {
      const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_PATH = request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async updateUserStatus (request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_PATH = request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}/status/${request.params.status}`;

      const response = await ServerHttp.put(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async deleteUser (request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers: { ...headers, "Content-Type": "text/plain" }
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_PATH = request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${request.params.emailId}`;
      const response = await ServerHttp.delete(url, options);
      return h.response(response.body).code(response.status);

    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async getNewUserRoles (request, h) {
    try {
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const ROLE_PATH = request.app.ccmGet("USER_CONFIG.ROLE_PATH");
      const url = `${BASE_URL}${ROLE_PATH}`;
      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };
      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async getNewUserBrands (request, h) {
    try {
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const ASSIGNABLE_BRANDS_PATH = request.app.ccmGet("USER_CONFIG.ASSIGNABLE_BRANDS_PATH");
      const url = `${BASE_URL}${ASSIGNABLE_BRANDS_PATH}`;

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }


  async getUserInfo (request, h) {

    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_SELF_INFO_PATH = request.app.ccmGet("USER_CONFIG.USER_SELF_INFO_PATH");
      const url = `${BASE_URL}${USER_SELF_INFO_PATH}`;
      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async loginSuccessRedirect (request, h) {
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

      return h.redirect("/");
    } catch (err) {
      console.error("got error in authorization: ", err);
      throw err;
    }
  }

  async logout(request, h) {
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
      // console.log("hapi state ========= ", h.state("auth_sessio_token"));
      return h.redirect("/");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getLogoutProvider(request, h) {
    try {
      const logoutProviderURL = request.app.ccmGet("IAM.FALCON_LOGOUT_URL");
      return h.response(logoutProviderURL).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async redirectToFalcon (request, h) {
    try {
      return h.redirect(falcon.generateFalconRedirectURL(request, request.params.action));
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAccessToken(request, authorizationCode) {
    try {
      const IAM = request.app.ccmGet("IAM");
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
      return response.body;

    } catch (err) {
      throw err;
    }
  }


}

export default new UserManagerApi();
