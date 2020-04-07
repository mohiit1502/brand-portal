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
    server.route([
      // {
      //   method: "POST",
      //   path: "/api/login/access-token",
      //   handler: this.getAccessToken
      // },
      {
        method: "GET",
        path: "/api/login/falcon-redirect",
        handler: this.redirectToFalcon
      },
      {
        method: "GET",
        path: "/login-redirect",
        handler: this.loginSuccessRedirect
      }
    ]);

  }

  async loginSuccessRedirect (request, h) {
    const query = request.query;
    // eslint-disable-next-line camelcase
    const {id_token} = await this.getAccessToken(query.code);
    const user = await ServerUtils.decryptToken(id_token);
    return h.redirect(`/demo1?id_token=${JSON.stringify(user)}`);
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
      return await fetchJSON(url, options);

    } catch (err) {
      throw err;
    }
  }


}

export default new UserManagerApi();
