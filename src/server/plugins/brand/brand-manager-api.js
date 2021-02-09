/* eslint-disable no-unused-expressions */
import ServerHttp from "../../utility/ServerHttp";
import ServerUtils from "../../utility/server-utils";

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

  async getBrands(request, h) {

    try {
      const param = request.query && request.query.brandStatus;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const BRANDS_PATH = request.app.ccmGet("BRAND_CONFIG.BRANDS_PATH");
      const url = param ? `${BASE_URL}${BRANDS_PATH}?brandStatus=${param}` : `${BASE_URL}${BRANDS_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
    }

  async createBrand(request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8092";
      const BRANDS_PATH = request.app.ccmGet("BRAND_CONFIG.BRANDS_PATH");
      const url = `${BASE_URL}${BRANDS_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async updateBrand(request, h) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      const BRANDS_PATH = request.app.ccmGet("BRAND_CONFIG.BRANDS_PATH");
      const url = `${BASE_URL}${BRANDS_PATH}/${request.params.brandId}`;
      const response = await ServerHttp.put(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async checkUnique(request, h) {
    try {
      // const payload = request.payload;
      const headers = ServerUtils.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("BRAND_CONFIG.BASE_URL");
      let UNIQUENESS_CHECK_PATH = request.app.ccmGet("BRAND_CONFIG.UNIQUENESS_CHECK_PATH");
      // const UNIQUENSS_CHECK_PATH = `/ropro/umf/v1/brands/${request.query.email}/uniqueness`; //request.app.ccmGet("USER_CONFIG.USER_PATH");
      UNIQUENESS_CHECK_PATH && (UNIQUENESS_CHECK_PATH = UNIQUENESS_CHECK_PATH.replace("__brandName__", request.query.brandName));
      const url = `${BASE_URL}${UNIQUENESS_CHECK_PATH}`;
      delete request.query.brandName; // appended already above to URL as different key

      const response = await ServerHttp.get(url, options, request.query);
      return h.response(response.body).code(response.status);
    } catch (err) {
      return h.response(err).code(err.status);
    }
  }

}

export default new BrandManagerApi();
