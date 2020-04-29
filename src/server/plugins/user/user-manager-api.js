import { fetchJSON } from "@walmart/electrode-fetch";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import falcon from "../../components/auth/falcon";
import CONSTANTS from "../../constants/server-constants";
import ServerUtils from "../../utility/ServerUtils";

class UserManagerApi {
  constructor() {
    this.register = this.register.bind(this);
    this.loginSuccessRedirect = this.loginSuccessRedirect.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);

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
    server.state("session_token", {
      isSecure: false,
      isHttpOnly: false,
      domain: "localhost",
      isSameSite: false
    });
    server.route([
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
        path: "/login-redirect",
        handler: this.loginSuccessRedirect
      }
    ]);

  }

  async getUserInfo (request, h) {

    try {
      //temporary login below
      const login = await this.loginStaticUser();
      //temporary login above
      const authToken = login.payload.authenticationToken.authToken;
      const headers = {
        ROPRO_AUTH_TOKEN: authToken,
        ROPRO_USER_ID:	"test.admin@ropro.com",
        ROPRO_CLIENT_ID:	"abcd"
      };
      const options = {
        method: "GET",
        headers
      };

      const json = await fetchJSON("http://umf.ropro.stg.walmart.com/ropro/umf/v1/user/me", options);
      return json;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async loginStaticUser() {
    const headers = {
      "WM_SVC.ENV": "stg",
      "WM_CONSUMER.ID":	"c57c1b08-77a7-48bc-9789-f7176fa1e454",
      "WM_QOS.CORRELATION_ID":	"SOMECORRELATIONID",
      "WM_SVC.NAME":	"platform-iam-server",
      "WM_SVC.VERSION":	"1.0.0",
      "WM_CONSUMER.NAME": "seller-portal-app"
    };
    const options = {
      body: JSON.stringify(
        {
          payload: {
            password: "Test@123",
            realmId: "fe6be7ac-78a1-11ea-bc55-0242ac130003",
            tenantId: "YUMA_SUPPLIER",
            userId: "test.admin@ropro.com"
          }
        }
      ),
      method: "POST",
      headers
    };

    const json = await fetchJSON("https://stg.iam.platform.prod.walmart.com/platform-iam-server/iam/authnService", options);
    return json;
  }

  async loginSuccessRedirect (request, h) {
    const query = request.query;
    const ttl = 30 * 60 * 1000;
    // eslint-disable-next-line camelcase
    const {id_token} = await this.getAccessToken(query.code);
    const user = await ServerUtils.decryptToken(id_token);
    h.state("session_token", id_token, {ttl});
    return h.redirect(`/user-management/user-list?id_token=${JSON.stringify(user)}`);
  }

  async redirectToFalcon (request, h) {
    return h.redirect(falcon.generateLoginURL());
  }

  async getAccessToken(authorizationCode) {
    try {
      const url = CONSTANTS.IAM.IAM_TOKEN_URL;
      const clientId = CONSTANTS.IAM.CLIENT_ID;
      const clientSecret = CONSTANTS.IAM.CLIENT_SECRET;
      const encoding = CONSTANTS.IAM.ENCODING;

      const payload =   {
        code: authorizationCode,
        redirect_uri: CONSTANTS.IAM.REDIRECT_URL,
        grant_type: CONSTANTS.IAM.GRANT_TYPE
      };

      const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString(encoding);
      const headers = {
        Authorization: `Basic ${base64}`,
        "WM_SVC.ENV": "stg",
        "WM_CONSUMER.ID":	"22e991f3-e61f-4c46-9a16-47142ea5f6a2",
        "WM_QOS.CORRELATION_ID":	"SOMECORRELATIONID",
        "WM_SVC.NAME":	"platform-sso-server",
        "WM_SVC.VERSION":	"1.0.0",
        "WM_CONSUMER.NAME": "seller-portal-app"
      };
      const options = {
        body: JSON.stringify(payload),
        method: "POST",
        headers
      };

      const json = await fetchJSON(url, options);
      return json;

    } catch (err) {
      console.error(err);
      throw err;
    }
  }


}

export default new UserManagerApi();
