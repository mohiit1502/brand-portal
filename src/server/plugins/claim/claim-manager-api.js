import ServerHttp from "../../utility/ServerHttp";

class ClaimManagerApi {
  constructor() {
    this.name = "ClaimManagerApi";
    this.getClaims = this.getClaims.bind(this);
    this.createClaim = this.createClaim.bind(this);
    this.getClaimTypes = this.getClaimTypes.bind(this);
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        path: "/api/claims",
        handler: this.getClaims
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

  async getClaimTypes(request, h) {
    try {
      const headers = this.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIM_TYPES_PATH = request.app.ccmGet("CLAIM_CONFIG.CLAIM_TYPES_PATH");
      const url = `${BASE_URL}${CLAIM_TYPES_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }


  async getClaims(request, h) {

    try {
      const headers = this.getHeaders(request);
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = request.app.ccmGet("CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      const response = await ServerHttp.get(url, options);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }


  async createClaim(request, h) {
    try {
      const headers = this.getHeaders(request);
      const payload = request.payload;
      const options = {
        headers
      };

      const BASE_URL = request.app.ccmGet("CLAIM_CONFIG.BASE_URL");
      const CLAIMS_PATH = request.app.ccmGet("CLAIM_CONFIG.CLAIMS_PATH");
      const url = `${BASE_URL}${CLAIMS_PATH}`;

      const response = await ServerHttp.post(url, options, payload);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ClaimManagerApi();
