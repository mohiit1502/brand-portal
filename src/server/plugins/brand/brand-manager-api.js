/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import ServerHttp from "../../utility/ServerHttp";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";

class BrandManagerApi {
  constructor() {
    this.name = "BrandManagerApi";
    this.register = this.register.bind(this);
    this.getBrands = this.getBrands.bind(this);
    this.createBrand = this.createBrand.bind(this);
    this.updateBrand = this.updateBrand.bind(this);
  }

  register (server) {

    return server.route([
      {
        method: "GET",
        path: "/api/brands",
        handler: this.getBrands
      },
      {
        method: "POST",
        path: "/api/brands",
        handler: this.createBrand
      },
      {
        method: "PUT",
        path: "/api/brands/{brandId}",
        handler: this.updateBrand
      },
      {
        method: "GET",
        path: "/api/brands/checkUnique",
        handler: this.checkUnique
      }
    ]);
  }

  // eslint-disable-next-line max-statements
  async getBrands(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][BrandManagerApi::getBrands] API request for get Brand has started", corrId);
    console.log("[Corr ID: %s][BrandManagerApi::getBrands] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/brands"
    };
    try {
      const param = request.query && request.query.brandStatus;
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };

      console.log("[Corr ID: %s][BrandManagerApi::getBrands] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      // const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const BRANDS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BRANDS_PATH");
      const url = param ? `${BASE_URL}${BRANDS_PATH}?brandStatus=${param}` : `${BASE_URL}${BRANDS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);

      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][BrandManagerApi::getBrands] API request for get Brand has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][BrandManagerApi::getBrands] Error occurred in API request for get Brand:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.GET_BRANDS, mixpanelPayload);
    }
    }

  // eslint-disable-next-line max-statements
  async createBrand(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][BrandManagerApi::createBrand] API request for Create Brand has started", corrId);
    console.log("[Corr ID: %s][BrandManagerApi::createBrand] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/brands"
    };
    try {
      const payload = request.payload;
      const options = {
        headers
      };

      console.log("[Corr ID: %s][BrandManagerApi::createBrand] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8092";
      const BRANDS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BRANDS_PATH");
      const url = `${BASE_URL}${BRANDS_PATH}`;
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.BRAND_NAME = payload && payload.name;
      mixpanelPayload.TRADE_MARK_NUMBER = payload && payload.trademarkNumber;
      mixpanelPayload.USPTO_URL = payload && payload.usptoUrl;
      mixpanelPayload.USPTO_VERIFICATION = payload && payload.usptoVerification;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.post(url, options, payload, "REGISTER_BRAND");

      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][BrandManagerApi::createBrand] API request for Create Brand has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][BrandManagerApi::createBrand] Error occurred in API request for Create Brand:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.CREATE_BRAND, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async updateBrand(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][BrandManagerApi::updateBrand] API request for Update Brand has started", corrId);
    console.log("[Corr ID: %s][BrandManagerApi::updateBrand] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/brands/${request.params && request.params.brandId}`
    };
    try {
      const payload = request.payload;
      const options = {
        headers
      };

      console.log("[Corr ID: %s][BrandManagerApi::updateBrand] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const BRANDS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BRANDS_PATH");
      const url = `${BASE_URL}${BRANDS_PATH}/${request.params.brandId}`;
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.put(url, options, payload);
      console.log("[Corr ID: %s][BrandManagerApi::updateBrand] API request for Update Brand has completed", corrId);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][BrandManagerApi::updateBrand] Error occurred in API request for Update Brand:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.UPDATE_BRAND, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async checkUnique(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][BrandManagerApi::checkUnique] API request for Brand Uniqueness has started", corrId);
    console.log("[Corr ID: %s][BrandManagerApi::checkUnique] User ID: ", corrId, request.state && request.state.bp_session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/brands/checkUnique",
      BRAND_NAME: request.query && request.query.brandName,
      WORK_FLOW: "BRAND_WORKFLOW"
    };
    try {
      // const payload = request.payload;
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };

      console.log("[Corr ID: %s][BrandManagerApi::checkUnique] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      let UNIQUENESS_CHECK_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.UNIQUENESS_CHECK_PATH");
      // const UNIQUENSS_CHECK_PATH = `/ropro/umf/v1/brands/${request.query.email}/uniqueness`; //request.app.ccmGet("USER_CONFIG.USER_PATH");
      UNIQUENESS_CHECK_PATH && (UNIQUENESS_CHECK_PATH = UNIQUENESS_CHECK_PATH.replace("__brandName__", request.query.brandName));
      const url = `${BASE_URL}${UNIQUENESS_CHECK_PATH}`;
      delete request.query.brandName; // appended already above to URL as different key

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;
      const response = await ServerHttp.get(url, options, request.query);
      console.log("[Corr ID: %s][BrandManagerApi::checkUnique] API request for Brand Uniqueness has completed", corrId);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][BrandManagerApi::checkUnique] Error occurred in API request for Brand Uniqueness:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.BRAND_UNIQUENESS, mixpanelPayload);
    }
  }

}

export default new BrandManagerApi();
