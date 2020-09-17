/* eslint-disable no-console */
import {CONSTANTS} from "../../constants/server-constants";

class ContentManagerApi {
  constructor() {
    this.name = "ContentManagerApi";
    this.getHelpConfiguration = this.getHelpConfiguration.bind(this);
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        path: "/api/helpConfig",
        handler: this.getHelpConfiguration
      },
      {
        method: "GET",
        path: "/api/loginConfig",
        handler: this.getLandingPageConfiguration
      }
    ]);
  }

  async getHelpConfiguration(request, h) {
    try {
      const configuration = request.app.ccmGet("CONTENT_CONFIG.HELPDESCRIPTOR");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getLandingPageConfiguration(request, h) {
    try {
      const configuration = request.app.ccmGet("CONTENT_CONFIG.LANDINGPAGEDESCRIPTOR");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ContentManagerApi();
