import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import ServerUtils from "../../utility/server-utils";

class CompanyManagerApi {
  constructor() {
    this.name = "CompanyManagerApi";
    this.register = this.register.bind(this);
    this.registerOrganization = this.registerOrganization.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
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
      ROPRO_AUTH_TOKEN: request.state.auth_session_token,
      ROPRO_USER_ID:	request.state.session_token_login_id,
      ROPRO_CLIENT_ID:	"abcd",
      ROPRO_CORRELATION_ID: "sdfsdf"
    };
  }

  async registerOrganization (request, h) {
    try {
      const headers = this.getHeaders(request);
      const options = {
        method: "POST",
        headers
      };
      const payload = request.payload;
      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const REGISTER_ORG_PATH = request.app.ccmGet("BRAND_CONFIG.REGISTER_ORG_PATH");
      const url = `${BASE_URL}${REGISTER_ORG_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async checkTrademarkValidity (request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const TM_VALIDITY_PATH = request.app.ccmGet("BRAND_CONFIG.TM_VALIDITY_PATH");
      const url = `${BASE_URL}${TM_VALIDITY_PATH}/${request.params.trademarkNumber}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async uploadAdditionalDocument (request, h) {
    try {

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const buffer = await file.read();
      const fd = new FormData();
      fd.append("file", buffer.toString("utf-8"), {filename});
      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const ADDITIONAL_DOC_PATH = request.app.ccmGet("BRAND_CONFIG.ADDITIONAL_DOC_PATH");
      const url = `${BASE_URL}${ADDITIONAL_DOC_PATH}`;

      const response = await ServerHttp.postAsFormData(url, options, fd);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async uploadBusinessDocument (request, h) {
    try {

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const buffer = await file.read();
      const fd = new FormData();
      fd.append("file", buffer.toString("utf-8"), {filename});
      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const BUSINESS_DOC_PATH = request.app.ccmGet("BRAND_CONFIG.BUSINESS_DOC_PATH");
      const url = `${BASE_URL}${BUSINESS_DOC_PATH}`;
      const response = await ServerHttp.postAsFormData(url, options, fd);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async checkCompanyNameAvailabililty (request, h) {
    try {
      const name = request.query.name;

      const headers = ServerUtils.getHeaders(request);

      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const COMPANY_NAME_UNIQUENESS_PATH = request.app.ccmGet("BRAND_CONFIG.COMPANY_NAME_UNIQUENESS_PATH");
      const url = `${BASE_URL}${COMPANY_NAME_UNIQUENESS_PATH}`;

      const response = await ServerHttp.get(url, options, {name});
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

}

export default new CompanyManagerApi();
