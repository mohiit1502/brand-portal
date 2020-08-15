/* eslint-disable no-console */
import ServerHttp from "../../utility/ServerHttp";
import {CONSTANTS, IQS_URL} from "./../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";

class ClaimManagerApi {
  constructor() {
    this.name = "ClaimManagerApi";
    this.getClaims = this.getClaims.bind(this);
    this.createClaim = this.createClaim.bind(this);
    this.getClaimTypes = this.getClaimTypes.bind(this);
    this.getSellers = this.getSellers.bind(this);
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        path: "/api/claims",
        handler: this.getClaims
      },
      {
        method: "GET",
        path: "/api/claims/{ticketId}",
        handler: this.getClaim
      },
      {
        method: "POST",
        path: "/api/claims",
        handler: this.createClaim
      },
      {
        method: "GET",
        path: "/api/claims/types",
        handler: this.getClaimTypes
      },
      {
        method: "GET",
        path: "/api/sellers",
        handler: this.getSellers
      }

    ]);
  }

  // getHeaders(request) {
  //   return {
  //     ROPRO_AUTH_TOKEN: request.state.auth_session_token,
  //     ROPRO_USER_ID:	request.state.session_token_login_id,
  //     ROPRO_CLIENT_ID:	"abcd",
  //     ROPRO_CORRELATION_ID: "sdfsdf"
  //   };
  // }

  getIQSHeaders() {
    return {
      "WM_SVC.VERSION": "0.0.1",
      "WM_SVC.NAME": "item-setup-query-service-app",
      "WM_QOS.CORRELATION_ID": "abcd",
      "WM_SVC.ENV": "prod",
      "WM_CONSUMER.ID": "6aa8057e-8795-450a-b349-4ba99b633d2e",
      Accept: "application/json"
    };
  }

  parseSellersFromResponse = response => {
    const sellers = response && response.payload.indexData;
    const sellersParsed = sellers.map(seller => seller.seller_id && {value: seller.partner_display_name, id: seller.seller_id}).filter(seller => seller);
    return sellersParsed;
  }

  async getSellers(request, h) {
    try {
      const headers = this.getIQSHeaders(request);
      const options = {
        headers
      };
      // console.log("get seller options ======= ", JSON.stringify(request.query));
      let url = IQS_URL;
      url = url.replace("__itemId__", request.query.payload);

      console.log("Making IQS API call to: ", url);
      const response = await ServerHttp.get(url, options);
      console.log("Response in ClaimsManagerApi.getSellers ==> from IQS: ", response);
      let responseBody = [];
      if (response && response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        responseBody = this.parseSellersFromResponse(response.body);
      } else if (response && response.status === CONSTANTS.STATUS_CODE_NOT_FOUND) {
        responseBody = response;
      }
      return h.response(responseBody).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

  async getClaimTypes(request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIM_TYPES_PATH = request.app.ccmGet("CLAIM_CONFIG.CLAIM_TYPES_PATH");
      const url = `${BASE_URL}${CLAIM_TYPES_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }


  async getClaims(request, h) {

    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = request.app.ccmGet("CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getClaim(request, h) {

    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = `${request.app.ccmGet("CLAIM_CONFIG.CLAIMS_PATH")}/${request.params.ticketId}`;
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }


  async createClaim(request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = request.app.ccmGet("CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ClaimManagerApi();
