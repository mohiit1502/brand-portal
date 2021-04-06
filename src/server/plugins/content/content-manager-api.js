/* eslint-disable no-console */
import {CONSTANTS} from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import LandingPageConfiguration from "../../static/landing-page-configuration";

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
      },
      {
        method: "GET",
        path: "/api/formConfig",
        handler: this.getFormFieldConfiguration
      },
      {
        method: "GET",
        path: "/api/mixpanelConfig",
        handler: this.getMixpanelConfiguration
      }
    ]);
  }

  async getHelpConfiguration(request, h) {
    return h.response(LandingPageConfiguration).code(CONSTANTS.STATUS_CODE_SUCCESS);
  }

  async getLandingPageConfiguration(request, h) {
    try {
      const configuration = await ServerUtils.ccmGet(request,"CONTENT_CONFIG.LANDINGPAGEDESCRIPTOR");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getFormFieldConfiguration(request, h) {
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.FORMFIELDCONFIG");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getMixpanelConfiguration (request, h) {
    try {
      const projectToken = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.MIXPANEL_PROJECT_TOKEN");
      return h.response({projectToken}).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ContentManagerApi();
