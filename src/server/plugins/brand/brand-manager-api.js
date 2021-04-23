/* eslint-disable no-unused-expressions */
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

  // getHeaders(request) {
  //   return {
  //     ROPRO_AUTH_TOKEN: request.state.auth_session_token,
  //     ROPRO_USER_ID:	request.state.session_token_login_id,
  //     ROPRO_CLIENT_ID:	"abcd",
  //     ROPRO_CORRELATION_ID: "sdfsdf"
  //   };
  // }

  // eslint-disable-next-line max-statements
  async getBrands(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/brands"
    };
    try {
      const param = request.query && request.query.brandStatus;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request,"BRAND_CONFIG.BASE_URL");
      // const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const BRANDS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BRANDS_PATH");
      const url = param ? `${BASE_URL}${BRANDS_PATH}?brandStatus=${param}` : `${BASE_URL}${BRANDS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;

      const response = await ServerHttp.get(url, options);

      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.GET_BRANDS, mixpanelPayload);
    }
    }

  // eslint-disable-next-line max-statements
  async createBrand(request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/brands"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

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

      const response = await ServerHttp.post(url, options, payload);

      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.CREATE_BRAND, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async updateBrand(request, h) {
    const mixpanelPayload = {
      METHOD: "PUT",
      API: `/api/brands/${request.params && request.params.brandId}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const BRANDS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BRANDS_PATH");
      const url = `${BASE_URL}${BRANDS_PATH}/${request.params.brandId}`;
      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.put(url, options, payload);

      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.UPDATE_BRAND, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async checkUnique(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/brands/checkUnique",
      BRAND_NAME: request.query && request.query.brandName,
      WORK_FLOW: "BRAND_WORKFLOW"
    };
    try {
      // const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      let UNIQUENESS_CHECK_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.UNIQUENESS_CHECK_PATH");
      // const UNIQUENSS_CHECK_PATH = `/ropro/umf/v1/brands/${request.query.email}/uniqueness`; //request.app.ccmGet("USER_CONFIG.USER_PATH");
      UNIQUENESS_CHECK_PATH && (UNIQUENESS_CHECK_PATH = UNIQUENESS_CHECK_PATH.replace("__brandName__", request.query.brandName));
      const url = `${BASE_URL}${UNIQUENESS_CHECK_PATH}`;
      delete request.query.brandName; // appended already above to URL as different key

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      const response = await ServerHttp.get(url, options, request.query);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.BRANDS_API.BRAND_UNIQUENESS, mixpanelPayload);
    }
  }

}

export default new BrandManagerApi();
