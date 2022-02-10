/* eslint-disable max-statements */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-magic-numbers */
import ServerHttp from "../../utility/ServerHttp";
import {CONSTANTS} from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";
import FormData from "form-data";
const secrets = require(CONSTANTS.PATH);

class ClaimManagerApi {
  constructor() {
    this.name = "ClaimManagerApi";
    this.getClaims = this.getClaims.bind(this);
    this.createClaim = this.createClaim.bind(this);
    this.getClaimTypes = this.getClaimTypes.bind(this);
    this.getSellers = this.getSellers.bind(this);
    this.uploadWebFormDocument = this.uploadWebFormDocument.bind(this);
    this.FILE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 10;
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
      },
      {
        method: "POST",
        path: "/api/claims/webform",
        handler: this.createWebformClaim
      },
      {
        method: "POST",
        path: "/api/claims/uploadWebFormDocument",
        handler: this.uploadWebFormDocument,
        config: {
          payload: {
            maxBytes: this.FILE_UPLOAD_SIZE_LIMIT,
            output: "stream",
            allow: "multipart/form-data"
          }
        }
      }
    ]);
  }

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
    return response.map(seller => seller["offer.sellerId"] && {value: seller["rollupoffer.partnerDisplayName"], id: seller["offer.sellerId"]}).filter(seller => seller);
  }

  async getSellers(request, h) {
    const headers = this.getIQSHeaders(request);
    const corrId = headers["WM_QOS.CORRELATION_ID"];
    console.log("[Corr ID: %s][ClaimManagerApi::getSellers] API request for Get Sellers has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::getSellers] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/sellers"
    };
    try {
      const options = {
        headers
      };
      console.log("[Corr ID: %s][ClaimManagerApi::getSellers] Fetching CCM dependencies", corrId);
      let payload = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.IQS_QUERY");
      payload = payload.replace("__itemId__", request.query.payload);
      const url = secrets.IQS_URL;
      let incrementalTimeouts = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.INCREMENTAL_TIMEOUTS");
      incrementalTimeouts = incrementalTimeouts && JSON.parse(incrementalTimeouts);
      mixpanelPayload.URL = url;
      mixpanelPayload.ITEM_ID = request.query && request.query.payload;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers["WM_QOS.CORRELATION_ID"];

      const response = await ServerUtils.retry({url, options, payload, type: "post"}, incrementalTimeouts || [50, 80, 100]);
      let responseBody = [];
      if (response && response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        responseBody = this.parseSellersFromResponse(response.body.docs);
      }
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][ClaimManagerApi::getSellers] API request for Get Sellers has completed", corrId);
      return h.response(responseBody).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ClaimManagerApi::getSellers] Error occurred in API request for Get Sellers:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_SELLERS, mixpanelPayload);
    }
  }
  async getClaimTypes(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][ClaimManagerApi::getClaimTypes] API request for Get Claim type has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::getClaimTypes] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/claims/types"
    };
    try {
      const options = {
        headers
      };

      console.log("[Corr ID: %s][ClaimManagerApi::getClaimTypes] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIM_TYPES_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIM_TYPES_PATH");
      const url = `${BASE_URL}${CLAIM_TYPES_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      console.log("[Corr ID: %s][ClaimManagerApi::getClaimTypes] API request for Get Claim type has completed", corrId);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ClaimManagerApi::getClaimTypes] Error occurred in API request for Get Claim type:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_CLAIM_TYPE, mixpanelPayload);
    }
  }


  async getClaims(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][ClaimManagerApi::getClaims] API request for Get Claims has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::getClaims] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/claims"
    };
    try {
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };

      console.log("[Corr ID: %s][ClaimManagerApi::getClaims] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][ClaimManagerApi::getClaims] API request for Get Claims has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ClaimManagerApi::getClaims] Error occurred in API request for Get Claims:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_CLAIMS, mixpanelPayload);
    }
  }

  async getClaim(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][ClaimManagerApi::getClaim] API request for Get Claim has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::getClaim] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: `/api/claims/${request.params && request.params.ticketId}`
    };
    try {
      const options = {
        headers
      };

      console.log("[Corr ID: %s][ClaimManagerApi::getClaim] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = `${await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIMS_PATH")}/${request.params.ticketId}`;
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][ClaimManagerApi::getClaim] API request for Get Claim has completed", corrId);
      if (response.status === CONSTANTS.STATUS_CODE_SUCCESS) {
        return h.response(response.body).code(response.status);
      } else {
        return h.response(response).code(response.status);
      }
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ClaimManagerApi::getClaim] Error occurred in API request for Get Claim:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.GET_CLAIM, mixpanelPayload);
    }
  }


  async createClaim(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][ClaimManagerApi::createClaim] API request for Create Claim has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::createClaim] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/claims"
    };
    try {
      const payload = request.payload;
      const options = {
        headers
      };

      console.log("[Corr ID: %s][ClaimManagerApi::createClaim] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.CLAIM_TYPE = payload && payload.claimType;
      mixpanelPayload.USPTO_URL = payload && payload.usptoUrl;
      mixpanelPayload.USPTO_VERIFICATION = payload && payload.usptoVerification;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][ClaimManagerApi::createClaim] API request for Create Claim has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ClaimManagerApi::createClaim] Error occurred in API request for Create Claim:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.CREATE_CLAIM, mixpanelPayload);
    }
  }

  async createWebformClaim(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/claims/webform"
    };
    console.log("[Corr ID: %s][ClaimManagerApi::createWebformClaim] API request for webform Create Claim has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::createWebformClaim] Client IP address:", corrId, request.info && request.info.remoteAddress);
    console.log("[Corr ID: %s][ClaimManagerApi::createWebformClaim] Client User Agent:", corrId, request.headers["user-agent"]);
    try {
      const payload = request.payload;
      payload.metaInfo = {
        userAgent: request.headers["user-agent"],
        clientIp: request.info.remoteAddress
      };
      delete headers.Consumer_id;
      delete headers.ROPRO_USER_ID;
      headers["WBP.MARKETPLACE"] = "US";
      const options = {
        headers
      };
      console.log("[Corr ID: %s][ClaimManagerApi::createWebformClaim] Client Email ID:", corrId, payload.reporterInfo && payload.reporterInfo.email ? payload.reporterInfo.email : "NOT FOUND IN PAYLOAD");
      console.log("[Corr ID: %s][ClaimManagerApi::createWebformClaim] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.WEBFORM_CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = payload && payload.reporterInfo && payload.reporterInfo.email;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.CLAIM_TYPE = payload && payload.claimType;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.BRAND_INFO = payload && payload.brandInfo;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload);
      console.log("[Corr ID: %s][ClaimManagerApi::createWebformClaim] API request for webform Create Claim has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.error("[Corr ID: %s][ClaimManagerApi::createWebformClaim] Error occurred in API request for webform Create Claim:", corrId, err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIMS_API.CREATE_WEBFORM_CLAIM, mixpanelPayload);
    }
  }

  async uploadWebFormDocument (request, h) {
    const headers = ServerUtils.getDocumentHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/claims/uploadWebFormDocument"
    };
    console.log("[Corr ID: %s][ClaimManagerApi::uploadWebFormDocument] API request for Upload Business document has started", corrId);
    console.log("[Corr ID: %s][ClaimManagerApi::uploadWebFormDocument] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      const options = {
        headers
      };
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const fd = new FormData();

      fd.append("file", file, {filename});
      console.log("[Corr ID: %s][ClaimManagerApi::uploadWebFormDocument] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const WEBFORM_DOC_PATH = await ServerUtils.ccmGet(request, "CLAIM_CONFIG.WEBFORM_DOC_PATH");
      const url = `${BASE_URL}${WEBFORM_DOC_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.FILE_NAME = filename;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;
      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("[Corr ID: %s][ClaimManagerApi::uploadWebFormDocument] 4. In CMA - post-request - Got Response from File Upload ====== ", corrId, response);
      console.log("[Corr ID: %s][ClaimManagerApi::uploadWebFormDocument] API request for Upload Webform document has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ClaimManagerApi::uploadWebFormDocument] Error occurred in API request for Upload Webform document:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_BUSINESS_DOCUMENT, mixpanelPayload);
    }
  }
}

export default new ClaimManagerApi();
