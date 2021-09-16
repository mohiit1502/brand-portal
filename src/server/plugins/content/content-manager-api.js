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
        path: "/api/modalConfig",
        handler: this.getModalConfiguration
      },
      {
        method: "GET",
        path: "/api/mixpanelConfig",
        handler: this.getMixpanelConfiguration
      },
      {
        method: "GET",
        path: "/api/webformConfig",
        handler: this.getWebformConfiguration
      },
      {
        method: "GET",
        path: "/api/getCaptchaConfig",
        handler: this.getCaptchaConfiguration
      }
    ]);
  }

  async getHelpConfiguration(request, h) {
    console.log("[ContentManagerApi::getHelpConfiguration] API request for Help configuration has started");
    console.log("[ContentManagerApi::getHelpConfiguration] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/helpConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.HELPDESCRIPTOR");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[ContentManagerApi::getHelpConfiguration] API request for Help configuration has completed");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ContentManagerApi::getHelpConfiguration] Error occured in API request for Help configuration:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_HELP_CONFIGURATION, mixpanelPayload);
    }
  }

  async getWebformConfiguration(request, h) {
    console.log("[ContentManagerApi::getWebformConfiguration] API request for Webform configuration has started");
    console.log("[ContentManagerApi::getWebformConfiguration] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.WEBFORMDESCRIPTOR");
      console.log("[ContentManagerApi::getWebformConfiguration] API request for Webform configuration has completed");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log("[ContentManagerApi::getWebformConfiguration] Error occured in API request for Webform configuration:", err);
      return h.response(err).code(err.status);
    }
  }

  async getLandingPageConfiguration(request, h) {
    console.log("[ContentManagerApi::getLandingPageConfiguration] API request for landing page configuration has started");
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/loginConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.LANDINGPAGEDESCRIPTOR");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      console.log("[ContentManagerApi::getHelpConfiguration] API request for landing page configuration has completed");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ContentManagerApi::getLandingPageConfiguration] Error occured in API request for landing page configuration:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_LANDING_PAGE_CONFIGURATION, mixpanelPayload);
    }
  }

  async getFormFieldConfiguration(request, h) {
    console.log("[ContentManagerApi::getFormFieldConfiguration] API request for form field configuration has started");
    console.log("[ContentManagerApi::getFormFieldConfiguration] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/formConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.FORMFIELDCONFIG");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[ContentManagerApi::getFormFieldConfiguration] API request for form field  configuration has completed");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ContentManagerApi::getFormFieldConfiguration] Error occured in API request for form field configuration:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_FORM_FIELD_CONFIGURATION, mixpanelPayload);
    }
  }

  async getModalConfiguration(request, h) {
    console.log("[ContentManagerApi::getModalConfiguration] API request for modal configuration has started");
    console.log("[ContentManagerApi::getModalConfiguration] User ID: ", request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/modalConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.MODALSCONFIG");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[ContentManagerApi::getModalConfiguration] API request for modal configuration has completed");
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[ContentManagerApi::getModalConfiguration] Error occurred in API request for modal configuration:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_MODAL_CONFIGURATION, mixpanelPayload);
    }
  }

  async getMixpanelConfiguration (request, h) {
    console.log("[ContentManagerApi::getMixpanelConfiguration] API request for mixpanel configuration has started");
    console.log("[ContentManagerApi::getMixpanelConfiguration] User ID: ", request.state && request.state.session_token_login_id);
    try {
      let response = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.MIXPANEL_PROJECT_TOKEN");
      response = JSON.parse(response);
      const projectToken = response.projectToken;
      const enableTracking = response.enableTracking;
      mixpanel.setToken(projectToken, enableTracking);
      console.log("[ContentManagerApi::getMixpanelConfiguration] API request for mixpanel configuration has completed");
      return h.response({projectToken, enableTracking}).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log("[ContentManagerApi::getMixpanelConfiguration] Error occured in API request for mixpanel field configuration:", err);
      return h.response(err).code(err.status);
    }
  }
  async getCaptchaConfiguration(request, h) {
    console.log("[ContentManagerApi::getCaptchaConfiguration] API request for reCaptcha configuration has started");
    try {
      let response = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.CAPTCHA_CONFIGURATION");
      response = JSON.parse(response);
      console.log("[ContentManagerApi::getCaptchaConfiguration] API request for reCaptcha configuration has completed");
      return h.response(response).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.log("[ContentManagerApi::getCaptchaConfiguration] Error occurred in API request for reCaptcha configuration:", err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ContentManagerApi();
