/* eslint-disable no-console */
import ServerHttp from "../../utility/ServerHttp";
import {CONSTANTS} from "./../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
const secrets = require(CONSTANTS.PATH);

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
      "WM_QOS.CORRELATION_ID": ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH),
      "WM_SVC.ENV": "stg",
      "WM_CONSUMER.ID": "d3f2b7d1-f86f-4ec0-98be-3c2a45e7e743",
      Accept: "application/json"
    };
  }

  parseSellersFromResponse = response => {
    const sellers = response
    const sellersParsed = sellers.map(seller => seller['offer.sellerId'] && {value: seller['rollupoffer.partnerDisplayName'], id: seller['offer.sellerId']}).filter(seller => seller);
    return sellersParsed;
  }

  async getSellers(request, h) {
    try {
      const headers = this.getIQSHeaders(request);
      const options = {
        headers
      };
      let payload = request.app.ccmGet("CLAIM_CONFIG.IQS_QUERY");
      payload = payload.replace("__itemId__", request.query.payload);

      let url = secrets.IQS_URL;

      const response = await ServerHttp.post(url, options, payload);
      let responseBody = [];
      if (response && response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        responseBody = this.parseSellersFromResponse(response.body.docs);
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
      if (response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        return h.response(response.body).code(response.status);
      } else {
        return h.response(response).code(response.status);
      }
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
