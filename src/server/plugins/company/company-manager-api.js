/* eslint-disable max-statements */
import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import ServerUtils from "../../utility/server-utils";
import { CONSTANTS } from "../../constants/server-constants";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";

class CompanyManagerApi {
  constructor() {
    this.name = "CompanyManagerApi";
    this.register = this.register.bind(this);
    this.registerOrganization = this.registerOrganization.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    this.uploadBusinessDocument = this.uploadBusinessDocument.bind(this);
    this.uploadAdditionalDocument = this.uploadAdditionalDocument.bind(this);
    this.FILE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 10; // 10MB
  }

  register (server) {
    return server.route([
      {
        method: "GET",
        path: "/api/company/availability",
        handler: this.checkCompanyNameAvailabililty
      },
      {
        method: "POST",
        path: "/api/company/uploadBusinessDocument",
        handler: this.uploadBusinessDocument,
        config: {
          payload: {
            maxBytes: this.FILE_UPLOAD_SIZE_LIMIT,
            output: "stream",
            allow: "multipart/form-data"
          }
        }
      },
      {
        method: "POST",
        path: "/api/company/uploadAdditionalDocument",
        handler: this.uploadAdditionalDocument,
        config: {
          payload: {
            maxBytes: this.FILE_UPLOAD_SIZE_LIMIT,
            output: "stream",
            allow: "multipart/form-data"
          }
        }
      },
      {
        method: "GET",
        path: "/api/brand/trademark/validity/{trademarkNumber}",
        handler: this.checkTrademarkValidity
      },
      {
        method: "POST",
        path: "/api/org/register",
        handler: this.registerOrganization
      }
    ]);
  }

  getHeaders(request) {
    return {
      "transfer-encoding": "chunked",
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "*/*",
      ROPRO_AUTH_TOKEN: request.state.auth_session_token,
      ROPRO_USER_ID:	request.state.session_token_login_id,
      ROPRO_CLIENT_ID:	"abcd",
      ROPRO_CORRELATION_ID: ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH)
    };
  }

  async registerOrganization (request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/org/register"
    };
    try {
      const headers = ServerUtils.getHeaders(request);
      const options = {
        method: "POST",
        headers
      };
      const payload = request.payload;
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const REGISTER_ORG_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.REGISTER_ORG_PATH");
      const url = `${BASE_URL}${REGISTER_ORG_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.TRADEMARK_NUMBER = payload && payload.brand &&  payload.brand.trademarkNumber;
      mixpanelPayload.BRAND_NAME = payload && payload.brand &&  payload.brand.name;
      mixpanelPayload.COMPANY_NAME = payload && payload.org && payload.org.name;
      mixpanelPayload.PAYLOAD = payload;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.REGISTER_ORGANIZATION, mixpanelPayload);
    }
  }

  async checkTrademarkValidity (request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: `/api/brand/trademark/validity/${request.params && request.params.trademarkNumber}`
    };
    try {
      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8092";
      const TM_VALIDITY_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.TM_VALIDITY_PATH");
      const url = `${BASE_URL}${TM_VALIDITY_PATH}/${request.params.trademarkNumber}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.TRADEMARK_NUMBER = request.params && request.params.trademarkNumber;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.CHECK_TRADEMARK_VALIDITY, mixpanelPayload);
    }
  }

  async uploadAdditionalDocument (request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/company/uploadAdditionalDocument"
    };
    try {

      const headers = this.getHeaders(request);

      const options = {
        headers
      };
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const fd = new FormData();
      fd.append("file", file, {filename});
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const ADDITIONAL_DOC_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.ADDITIONAL_DOC_PATH");
      const url = `${BASE_URL}${ADDITIONAL_DOC_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.FILE_NAME = filename;

      const response = await ServerHttp.postAsFormData(url, options, fd);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_ADDITIONAL_DOCUMENT, mixpanelPayload);
    }
  }

  async uploadBusinessDocument (request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/company/uploadBusinessDocument"
    };
    try {
      const headers = this.getHeaders(request);
      const options = {
        headers
      };
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const fd = new FormData();

      fd.append("file", file, {filename});
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const BUSINESS_DOC_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BUSINESS_DOC_PATH");
      const url = `${BASE_URL}${BUSINESS_DOC_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.FILE_NAME = filename;

      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("4. In CMA - post-request - Got Response from FIle Upload ====== ", response);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("5. In CMA - Error caught ======== ", err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_BUSINESS_DOCUMENT, mixpanelPayload);
    }
  }

  async checkCompanyNameAvailabililty (request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/company/availability"
    };
    try {
      const name = request.query.name;

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const COMPANY_NAME_UNIQUENESS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.COMPANY_NAME_UNIQUENESS_PATH");
      const url = `${BASE_URL}${COMPANY_NAME_UNIQUENESS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.COMPANY_NAME = name;

      const response = await ServerHttp.get(url, options, {name});
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.CHECK_COMPANY_NAME_AVAILABILILTY, mixpanelPayload);
    }
  }

}

export default new CompanyManagerApi();
