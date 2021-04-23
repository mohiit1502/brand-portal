/* eslint-disable no-console */
/* eslint-disable max-statements */
import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import ServerUtils from "../../utility/server-utils";
import { CONSTANTS } from "../../constants/server-constants";

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
    console.log("[CompanyManagerApi::registerOrganization] API request for Register organization has started");
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

      const response = await ServerHttp.post(url, options, payload);
      console.log("[CompanyManagerApi::registerOrganization] API request for Register organization has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("[CompanyManagerApi::registerOrganization] Error occured in API request for Register organization:", err);
      return h.response(err).code(err.status);
    }
  }

  async checkTrademarkValidity (request, h) {
    console.log("[CompanyManagerApi::checkTrademarkValidity] API request for Trademark Validity has started");
    try {
      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8092";
      const TM_VALIDITY_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.TM_VALIDITY_PATH");
      const url = `${BASE_URL}${TM_VALIDITY_PATH}/${request.params.trademarkNumber}`;

      const response = await ServerHttp.get(url, options);
      console.log("[CompanyManagerApi::checkTrademarkValidity] API request for Trademark Validity has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("[CompanyManagerApi::checkTrademarkValidity] Error occured in API request for Trademark Validity:", err);
      return h.response(err).code(err.status);
    }
  }

  async uploadAdditionalDocument (request, h) {
    console.log("[CompanyManagerApi::uploadAdditionalDocument] API request for Upload Additional Document has started");
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

      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("[CompanyManagerApi::uploadAdditionalDocument] API request for Upload Additional Document has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("[CompanyManagerApi::uploadAdditionalDocument] Error occured in API request for Upload Additional Document:", err);
      return h.response(err).code(err.status);
    }
  }

  async uploadBusinessDocument (request, h) {
    console.log("[CompanyManagerApi::uploadBusinessDocument] API request for Upload Business document has started");
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
      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("4. In CMA - post-request - Got Response from FIle Upload ====== ", response);
      console.log("[CompanyManagerApi::uploadBusinessDocument] API request for Upload Business document has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("5. In CMA - Error caught ======== ", err);
      console.log("[CompanyManagerApi::uploadBusinessDocument] Error occured in API request for Upload Business document:", err);
      return h.response(err).code(err.status);
    }
  }

  async checkCompanyNameAvailabililty (request, h) {
    console.log("[CompanyManagerApi::checkCompanyNameAvailabililty] API request for Company Name Avaialability has started");
    try {
      const name = request.query.name;

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const COMPANY_NAME_UNIQUENESS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.COMPANY_NAME_UNIQUENESS_PATH");
      const url = `${BASE_URL}${COMPANY_NAME_UNIQUENESS_PATH}`;

      const response = await ServerHttp.get(url, options, {name});
      console.log("[CompanyManagerApi::checkCompanyNameAvailabililty] API request for Company Name Avaialability has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("[CompanyManagerApi::checkCompanyNameAvailabililty] Error occured in API request for Company Name Avaialability:", err);
      return h.response(err).code(err.status);
    }
  }

}

export default new CompanyManagerApi();
