/* eslint-disable max-statements */
/* eslint-disable no-console */
import ServerHttp from "../../utility/ServerHttp";
import {CONSTANTS} from "./../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";
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
      "WM_SVC.ENV": "prod",
      "WM_CONSUMER.ID": "6aa8057e-8795-450a-b349-4ba99b633d2e",
      Accept: "application/json"
    };
  }

  parseSellersFromResponse = response => {
    const sellers = response
    const sellersParsed = sellers.map(seller => seller['offer.sellerId'] && {value: seller['rollupoffer.partnerDisplayName'], id: seller['offer.sellerId']}).filter(seller => seller);
    return sellersParsed;
  }

  async getSellers(request, h) {
    console.log("[ClaimManagerApi::getSellers] API request for Get Sellers has started");
    console.log("[ClaimManagerApi::getSellers] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/sellers"
    };
    try {
      const headers = this.getIQSHeaders(request);
      const options = {
        headers
      };
      let payload = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.IQS_QUERY");
      payload = payload.replace("__itemId__", request.query.payload);
      let url = secrets.IQS_URL;
      let incrementalTimeouts = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.INCREMENTAL_TIMEOUTS");
      incrementalTimeouts = incrementalTimeouts && JSON.parse( incrementalTimeouts );
      mixpanelPayload.URL = url;
      mixpanelPayload.ITEM_ID = request.query.payload;
      mixpanelPayload.API_SUCCESS = true;

      let response = await ServerUtils.retry ( request = { url, options, payload, type : "post" } , incrementalTimeouts || [ 50, 80, 100] );      
      let responseBody = [];
      if ( response && response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        responseBody = this.parseSellersFromResponse( response.body.docs );
      }
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[ClaimManagerApi::getSellers] API request for Get Sellers has completed");
      return h.response(responseBody).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ClaimManagerApi::getSellers] Error occured in API request for Get Sellers:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_SELLERS, mixpanelPayload);
    }
  }
  async getClaimTypes(request, h) {
    console.log("[ClaimManagerApi::getClaimTypes] API request for Get Claim type has started");
    console.log("[ClaimManagerApi::getClaimTypes] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/claims/types"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIM_TYPES_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIM_TYPES_PATH");
      const url = `${BASE_URL}${CLAIM_TYPES_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      console.log("[ClaimManagerApi::getClaimTypes] API request for Get Claim type has completed");
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ClaimManagerApi::getClaimTypes] Error occured in API request for Get Claim type:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_CLAIM_TYPE, mixpanelPayload);
    }
  }


  async getClaims(request, h) {
    console.log("[ClaimManagerApi::getClaims] API request for Get Claims has started");
    console.log("[ClaimManagerApi::getClaims] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/claims"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[ClaimManagerApi::getClaims] API request for Get Claims has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ClaimManagerApi::getClaims] Error occured in API request for Get Claims:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_CLAIMS, mixpanelPayload);
    }
  }

  async getClaim(request, h) {
    console.log("[ClaimManagerApi::getClaim] API request for Get Claim has started");
    console.log("[ClaimManagerApi::getClaim] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: `/api/claims/${request.params.ticketId}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = `${await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIMS_PATH")}/${request.params.ticketId}`;
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[ClaimManagerApi::getClaim] API request for Get Claim has completed");
      if (response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        return h.response(response.body).code(response.status);
      } else {
        return h.response(response).code(response.status);
      }
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ClaimManagerApi::getClaim] Error occured in API request for Get Claim:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_CLAIM, mixpanelPayload);
    }
  }


  async createClaim(request, h) {
    console.log("[ClaimManagerApi::createClaim] API request for Create Claim has started");
    console.log("[ClaimManagerApi::createClaim] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/claims"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.Email = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.CLAIM_TYPE = payload.claimType;
      mixpanelPayload.USPTO_URL = payload.usptoUrl;
      mixpanelPayload.USPTO_VERIFICATION = payload.usptoVerification;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[ClaimManagerApi::createClaim] API request for Create Claim has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ClaimManagerApi::createClaim] Error occured in API request for Create Claim:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.CREATE_CLAIM, mixpanelPayload);
    }
  }
}

export default new ClaimManagerApi();
