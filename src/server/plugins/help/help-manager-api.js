/* eslint-disable no-console */
import {CONSTANTS} from "./../../constants/server-constants";

class HelpManagerApi {
  constructor() {
    this.name = "HelpManagerApi";
    this.getHelpConfiguration = this.getHelpConfiguration.bind(this);
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        path: "/api/helpConfig",
        handler: this.getHelpConfiguration
      }
    ]);
  }

  async getHelpConfiguration(request, h) {
    try {
      const configuration = request.app.ccmGet("HELP_CONFIG.HELPDESCRIPTOR");
      console.log("HELP CONFIG: ", configuration);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new HelpManagerApi();
