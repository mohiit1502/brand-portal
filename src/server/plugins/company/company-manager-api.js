import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import FS from "fs";
import Stream from "stream";
import fetch from "node-fetch";

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
      const response = await ServerHttp.post(`http://brandservice.ropro.stg.walmart.com/ropro/org-service/org`, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async checkTrademarkValidity (request, h) {
    try {
      const options = {
        ROPRO_CORRELATION_ID: "sdfsdf",
        ROPRO_CLIENT_ID: "dsfasdf"
      };
      const response = await ServerHttp.get(`http://brandservice.ropro.stg.walmart.com/ropro/brand-service/brands/ip/${request.params.trademarkNumber}`, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async uploadAdditionalDocument (request, h) {
    try {

      const options = {};
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const buffer = await file.read();
      const fd = new FormData();
      fd.append("file", buffer.toString("utf-8"), {filename});
      const response = await ServerHttp.postAsFormData("http://brandservice.ropro.stg.walmart.com/ropro/org-service/org/additional-doc", options, fd);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async uploadBusinessDocument (request, h) {
    try {

      const options = {};
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const buffer = await file.read();
      const fd = new FormData();
      fd.append("file", buffer.toString("utf-8"), {filename});
      const response = await ServerHttp.postAsFormData("http://brandservice.ropro.stg.walmart.com/ropro/org-service/org/br-doc", options, fd);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async checkCompanyNameAvailabililty (request, h) {
    try {
      const name = request.query.name;
      const options = {
        ROPRO_CORRELATION_ID: "sdfsdf",
        ROPRO_CLIENT_ID: "dsfasdf"
      };
      const response = await ServerHttp.get("http://brandservice.ropro.stg.walmart.com/ropro/org-service/org/uniqueness", options, {name});
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

}

export default new CompanyManagerApi();
