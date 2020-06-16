import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import falcon from "../../components/auth/falcon";
import CONSTANTS from "../../constants/server-constants";
import ServerHttp from "../../utility/ServerHttp";
import ServerUtils from "../../utility/server-utils";


class UserManagerApi {

  constructor() {
    this.register = this.register.bind(this);
    this.loginSuccessRedirect = this.loginSuccessRedirect.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.logout = this.logout.bind(this);
    this.getNewUserRoles = this.getNewUserRoles.bind(this);
    this.getNewUserBrands = this.getNewUserBrands.bind(this);
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUserStatus = this.updateUserStatus.bind(this);
    this.updateUser = this.updateUser.bind(this);

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
        path: "/api/login/falcon-redirect",
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
      }
    ]);

  }

  getHeaders(request) {
    return {
      ROPRO_AUTH_TOKEN: request.state.auth_session_token,
      ROPRO_USER_ID:	request.state.session_token_login_id,
      ROPRO_CLIENT_ID:	"abcd"
    };
  }

  async updateUser (request, h) {
    try {
      const payload = request.payload.user;
      const headers = this.getHeaders(request);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("USER_CONFIG.BASE_URL");
      const USER_PATH = request.app.ccmGet("USER_CONFIG.USER_PATH");
      const url = `${BASE_URL}${USER_PATH}/${payload.loginId}`;

      const response = await ServerHttp.put(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async getUsers(request, h) {
    try {
      const headers = this.getHeaders(request);
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

  async createUser(request, h) {
    try {
      const payload = request.payload;
      const headers = this.getHeaders(request);
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
      const headers = this.getHeaders(request);
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

      const headers = this.getHeaders(request);
      const options = {
        method: "DELETE",
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
      const headers = this.getHeaders(request);

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

      const headers = this.getHeaders(request);

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
      const headers = {
        ROPRO_AUTH_TOKEN: request.state.auth_session_token,
        ROPRO_USER_ID:	request.state.session_token_login_id,
        ROPRO_CLIENT_ID:	"abcd"
      };
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

  async loginStaticUser() {
    try {
      const headers = {
        "WM_SVC.NAME": "platform-iam-server",
        "WM_SVC.ENV": "stg",
        "WM_CONSUMER.ID":	"c57c1b08-77a7-48bc-9789-f7176fa1e454",
        "WM_QOS.CORRELATION_ID":	"SOMECORRELATIONID",
        "WM_SVC.VERSION":	"1.0.0",
        "WM_CONSUMER.NAME": "seller-portal-app"
      };
      const options = {
        headers
      };

      const payload = {
        payload: {
          password: "Password@1234",
          realmId: "62b2aca3-dd67-4c05-9089-e7e538bb36e0",
          tenantId: "YumaSupplierExperience_ROOT",
          userId: " administratornew@cocacola.com"
        }
      };

      const url = "https://stg.iam.platform.prod.walmart.com/platform-iam-server/iam/authnService";

      const response = await ServerHttp.post(url, options, payload);
      return response.body;
    } catch (e) {
      throw e;
    }

  }

  async loginSuccessRedirect (request, h) {
    try {
      const query = request.query;
      const ttl = 30 * 60 * 1000;
      // eslint-disable-next-line camelcase
      const {id_token} = await this.getAccessToken(request, query.code);
      const user = await ServerUtils.decryptToken(id_token);
      const loginId = user.loginid;
      const authToken = user["iam-token"];

      //temporary login below
      // const login = await this.loginStaticUser();
      // const authToken = login.payload.authenticationToken.authToken;
      // const loginId = login.payload.principal.loginId;
      //temporary login above

      h.state("auth_session_token", authToken, {
        ttl,
        isSecure: false,
        isHttpOnly: false
      });
      h.state("session_token_login_id", loginId, {
        ttl,
        isSecure: false,
        isHttpOnly: false
      });


      return h.redirect(`/user-management/user-list`);
    } catch (err) {
      console.error(err);
      throw err;
    }

  }

  async logout(request, h) {
    try {
      h.unstate("auth_session_token");
      h.unstate("session_token_login_id");
      return h.redirect("/");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async redirectToFalcon (request, h) {
    try {
      return h.redirect(falcon.generateLoginURL(request));
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAccessToken(request, authorizationCode) {
    try {
      const IAM = request.app.ccmGet("IAM");

      const url = IAM.IAM_TOKEN_URL;
      const clientId = IAM.CLIENT_ID;
      const clientSecret = IAM.CLIENT_SECRET;
      const encoding = IAM.ENCODING;

      const payload =   {
        code: authorizationCode,
        redirect_uri: CONSTANTS.IAM.BASE_URL + IAM.REDIRECT_PATH,
        grant_type: IAM.GRANT_TYPE
      };

      const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString(encoding);
      const headers = {
        Authorization: `Basic ${base64}`,
        "WM_SVC.ENV": IAM["WM_SVC.ENV"],
        "WM_CONSUMER.ID": IAM["WM_CONSUMER.ID"],
        "WM_QOS.CORRELATION_ID": IAM["WM_QOS.CORRELATION_ID"],
        "WM_SVC.NAME": IAM["WM_SVC.NAME"],
        "WM_SVC.VERSION": IAM["WM_SVC.VERSION"],
        "WM_CONSUMER.NAME": IAM["WM_CONSUMER.NAME"]
      };
      const options = {
        headers
      };

      const response = await ServerHttp.post(url, options, payload); //fetchJSON(url, options);
      return response.body;

    } catch (err) {
      throw err;
    }
  }


}

export default new UserManagerApi();
