import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import FS from "fs";
import Stream from "stream";
import fetch from "node-fetch";

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

  async getBrands(request, h) {

    try {
      const headers = this.getHeaders(request);
      const options = {
        headers
      };

      const url = "http://brandservice.ropro.stg.walmart.com/ropro/brand-service/brands";
      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async createBrand(request, h) {
    try {
      const headers = this.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const url = "http://brandservice.ropro.stg.walmart.com/ropro/brand-service/brands";
      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async updateBrand(request, h) {
    try {
      const headers = this.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const url = `http://brandservice.ropro.stg.walmart.com/ropro/brand-service/brands/${request.params.brandId}`;
      const response = await ServerHttp.put(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }



}

export default new BrandManagerApi();
