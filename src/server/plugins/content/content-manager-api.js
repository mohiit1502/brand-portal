/* eslint-disable no-console */
import {CONSTANTS} from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";

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
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/helpConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request,"CONTENT_CONFIG.HELPDESCRIPTOR");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_HELP_CONFIGURATION, mixpanelPayload);
    }
  }

  async getLandingPageConfiguration(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/loginConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request,"CONTENT_CONFIG.LANDINGPAGEDESCRIPTOR");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_LANDING_PAGE_CONFIGURATION, mixpanelPayload);
    }
  }

  async getFormFieldConfiguration(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/formConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.FORMFIELDCONFIG");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;

      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_FORM_FIELD_CONFIGURATION, mixpanelPayload);
    }
  }

  async getMixpanelConfiguration (request, h) {
    try {
      const response = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.MIXPANEL_PROJECT_TOKEN");
      const projectToken = response.projectToken;
      const enableTracking = response.enableTracking;
      mixpanel.setToken(projectToken, enableTracking);
      return h.response({projectToken, enableTracking}).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ContentManagerApi();
