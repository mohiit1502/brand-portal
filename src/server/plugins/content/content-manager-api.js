/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable max-statements */
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
        path: "/api/sectionsConfig",
        handler: this.getSectionsConfiguration
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
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getHelpConfiguration] API request for Help configuration has started", corrId);
    console.log("[Corr ID: %s][ContentManagerApi::getHelpConfiguration] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/helpConfig"
    };
    try {
      console.log("[Corr ID: %s][ContentManagerApi::getHelpConfiguration] Initiating config fetch from CCM", corrId);
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.HELPDESCRIPTOR");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[Corr ID: %s][ContentManagerApi::getHelpConfiguration] API request for Help configuration has completed", corrId);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ContentManagerApi::getHelpConfiguration] Error occurred in API request for Help configuration:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_HELP_CONFIGURATION, mixpanelPayload);
    }
  }

  async getWebformConfiguration(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getWebformConfiguration] API request for Webform configuration has started", corrId);
    console.log("[Corr ID: %s][ContentManagerApi::getWebformConfiguration] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.WEBFORMDESCRIPTOR");
      console.log("[Corr ID: %s][ContentManagerApi::getWebformConfiguration] API request for Webform configuration has completed", corrId);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.error("[Corr ID: %s][ContentManagerApi::getWebformConfiguration] Error occurred in API request for Webform configuration:", corrId, err);
      return h.response(err).code(err.status);
    }
  }

  async getLandingPageConfiguration(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getLandingPageConfiguration] API request for landing page configuration has started", corrId);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/loginConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.LANDINGPAGEDESCRIPTOR");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      console.log("[Corr ID: %s][ContentManagerApi::getHelpConfiguration] API request for landing page configuration has completed", corrId);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ContentManagerApi::getLandingPageConfiguration] Error occurred in API request for landing page configuration:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_LANDING_PAGE_CONFIGURATION, mixpanelPayload);
    }
  }

  async getFormFieldConfiguration(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getFormFieldConfiguration] API request for form field configuration has started", corrId);
    console.log("[Corr ID: %s][ContentManagerApi::getFormFieldConfiguration] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/formConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.FORMFIELDCONFIG");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[Corr ID: %s][ContentManagerApi::getFormFieldConfiguration] API request for form field  configuration has completed", corrId);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ContentManagerApi::getFormFieldConfiguration] Error occurred in API request for form field configuration:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_FORM_FIELD_CONFIGURATION, mixpanelPayload);
    }
  }

  async getModalConfiguration(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getModalConfiguration] API request for modal configuration has started", corrId);
    console.log("[Corr ID: %s][ContentManagerApi::getModalConfiguration] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/modalConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.MODALSCONFIG");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[Corr ID: %s][ContentManagerApi::getModalConfiguration] API request for modal configuration has completed", corrId);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ContentManagerApi::getModalConfiguration] Error occurred in API request for modal configuration:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_MODAL_CONFIGURATION, mixpanelPayload);
    }
  }

  async getSectionsConfiguration(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getSectionsConfiguration] API request for sections configuration has started", corrId);
    console.log("[Corr ID: %s][ContentManagerApi::getSectionsConfiguration] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/sectionsConfig"
    };
    try {
      const configuration = await ServerUtils.ccmGet(request, "CONTENT_CONFIG.SECTIONSCONFIG");
      mixpanelPayload.RESPONSE_STATUS = CONSTANTS.STATUS_CODE_SUCCESS;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.distinct_id = request.state && request.state.session_token_login_id;
      console.log("[Corr ID: %s][ContentManagerApi::getSectionsConfiguration] API request for sections configuration has completed", corrId);
      return h.response(configuration).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][ContentManagerApi::getSectionsConfiguration] Error occurred in API request for sections configuration:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CONTENT_MANAGER_API.GET_SECTION_CONFIGURATION, mixpanelPayload);
    }
  }

  async getMixpanelConfiguration (request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getMixpanelConfiguration] API request for mixpanel configuration has started", corrId);
    console.log("[Corr ID: %s][ContentManagerApi::getMixpanelConfiguration] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      let response = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.MIXPANEL_PROJECT_TOKEN");
      response = JSON.parse(response);
      const projectToken = response.projectToken;
      const enableTracking = response.enableTracking;
      mixpanel.setToken(projectToken, enableTracking);
      console.log("[Corr ID: %s][ContentManagerApi::getMixpanelConfiguration] API request for mixpanel configuration has completed", corrId);
      return h.response({projectToken, enableTracking}).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.error("[Corr ID: %s][ContentManagerApi::getMixpanelConfiguration] Error occurred in API request for mixpanel field configuration:", corrId, err);
      return h.response(err).code(err.status);
    }
  }
  async getCaptchaConfiguration(request, h) {
    const corrId = ServerUtils.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH);
    console.log("[Corr ID: %s][ContentManagerApi::getCaptchaConfiguration] API request for reCaptcha configuration has started", corrId);
    try {
      let response = await ServerUtils.ccmGet(request, "EXTERNAL_SERVICE_CONFIG.CAPTCHA_CONFIGURATION");
      response = JSON.parse(response);
      console.log("[Corr ID: %s][ContentManagerApi::getCaptchaConfiguration] API request for reCaptcha configuration has completed", corrId);
      return h.response(response).code(CONSTANTS.STATUS_CODE_SUCCESS);
    } catch (err) {
      console.error("[Corr ID: %s][ContentManagerApi::getCaptchaConfiguration] Error occurred in API request for reCaptcha configuration:", corrId, err);
      return h.response(err).code(err.status);
    }
  }
}

export default new ContentManagerApi();
