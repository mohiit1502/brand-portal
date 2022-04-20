/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";

class CompanyManagerApi {
  constructor() {
    this.name = "CompanyManagerApi";
    this.register = this.register.bind(this);
    this.registerOrganization = this.registerOrganization.bind(this);
    this.checkTrademarkValidity = this.checkTrademarkValidity.bind(this);
    this.uploadBusinessDocument = this.uploadBusinessDocument.bind(this);
    this.uploadAdditionalDocument = this.uploadAdditionalDocument.bind(this);
    this.getApplicationDetails = this.getApplicationDetails.bind(this);
    this.FILE_UPLOAD_SIZE_LIMIT = 1024 * 1024 * 10; // 10MB
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        path: "/api/company/availability",
        handler: this.checkCompanyNameAvailability
      },
      {
        method: "POST",
        path: "/api/company/uploadBusinessDocument",
        handler: this.uploadBusinessDocument,
        config: {
          payload: {
            maxBytes: this.FILE_UPLOAD_SIZE_LIMIT,
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
            maxBytes: this.FILE_UPLOAD_SIZE_LIMIT,
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
      },
      {
        method: "GET",
        path: "/api/org/applicationDetails/{orgId}",
        handler: this.getApplicationDetails
      },
      {
        method: "PUT",
        path: "/api/org/updateContactInfo/{orgId}",
        handler: this.updateContactInfo
      },
      {
        method: "PUT",
        path: "/api/org/deleteSecondaryContactInfo",
        handler: this.deleteSecondaryContactInfo
      }
    ]);
  }

  /* eslint-disable complexity */
  async registerOrganization(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const context = request.query.context;
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/org/register",
      SUBMISSION_MODE: context
    };

    console.log("[Corr ID: %s][CompanyManagerApi::registerOrganization] API request for Register organization has started", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::registerOrganization] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        method: context === "edit" ? "PUT" : "POST",
        headers
      };
      console.log("[Corr ID: %s][CompanyManagerApi::registerOrganization] Fetching CCM dependencies", corrId);
      const payload = request.payload;
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const REGISTER_ORG_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.REGISTER_ORG_PATH");
      const url = `${BASE_URL}${REGISTER_ORG_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.TRADEMARK_NUMBER = payload && payload.brand && payload.brand.trademarkNumber;
      mixpanelPayload.BRAND_NAME = payload && payload.brand && payload.brand.name;
      mixpanelPayload.COMPANY_NAME = payload && payload.org && payload.org.name;
      mixpanelPayload.PAYLOAD = payload;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = context === "edit" ? await ServerHttp.put(url, options, payload, "UPDATE_ORG") : await ServerHttp.post(url, options, payload, "REGISTER_ORG");
      console.log("[Corr ID: %s][CompanyManagerApi::registerOrganization] API request for Register organization has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::registerOrganization] Error occurred in API request for Register organization:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.REGISTER_ORGANIZATION, mixpanelPayload);
    }
  }

  async checkTrademarkValidity(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "GET",
      API: `/api/brand/trademark/validity/${request.params && request.params.trademarkNumber}`
    };
    console.log("[Corr ID: %s][CompanyManagerApi::checkTrademarkValidity] API request for Trademark Validity has started", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::checkTrademarkValidity] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {headers};

      console.log("[Corr ID: %s][CompanyManagerApi::checkTrademarkValidity] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      // const BASE_URL = "http://localhost:8092";
      const TM_VALIDITY_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.TM_VALIDITY_PATH");
      const url = `${BASE_URL}${TM_VALIDITY_PATH}/${request.params.trademarkNumber}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.TRADEMARK_NUMBER = request.params && request.params.trademarkNumber;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      console.log("[Corr ID: %s][CompanyManagerApi::checkTrademarkValidity] API request for Trademark Validity has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::checkTrademarkValidity] Error occurred in API request for Trademark Validity:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.CHECK_TRADEMARK_VALIDITY, mixpanelPayload);
    }
  }

  async uploadAdditionalDocument(request, h) {
    const headers = ServerUtils.getDocumentHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/company/uploadAdditionalDocument"
    };
    console.log("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] API request for Upload Additional Document has started", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      const options = {headers};
      console.log("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] Fetching CCM dependencies", corrId);
      const file = request.payload.file;
      const filename = file.hapi.filename;
      try {
        const fileSize = Buffer.byteLength(file._data);
        console.log("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] Appending document with name: '%s' & size:", corrId, filename, fileSize);
      } catch (e) {
        console.error("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] Error while trying to find file size, ignoring...");
      }
      const fd = new FormData();
      fd.append("file", file, { filename });
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const ADDITIONAL_DOC_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.ADDITIONAL_DOC_PATH");
      const url = `${BASE_URL}${ADDITIONAL_DOC_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.FILE_NAME = filename;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] API request for Upload Additional Document has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::uploadAdditionalDocument] Error occurred in API request for Upload Additional Document:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_ADDITIONAL_DOCUMENT, mixpanelPayload);
    }
  }

  async uploadBusinessDocument(request, h) {
    const headers = ServerUtils.getDocumentHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/company/uploadBusinessDocument"
    };
    console.log("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] API request for Upload Business document has started", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      const options = {headers};
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const fd = new FormData();
      try {
        const fileSize = Buffer.byteLength(file._data);
        console.log("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] Appending document with name: '%s' & size:", corrId, filename, fileSize);
      } catch (e) {
        console.error("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] Error while trying to find file size, ignoring...");
      }
      fd.append("file", file, { filename });
      console.log("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const BUSINESS_DOC_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BUSINESS_DOC_PATH");
      const url = `${BASE_URL}${BUSINESS_DOC_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.FILE_NAME = filename;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("[Corr ID: %s]4. In CMA - post-request - Got Response from FIle Upload ====== ", corrId, response);
      console.log("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] API request for Upload Business document has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::uploadBusinessDocument] Error occurred in API request for Upload Business document:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_BUSINESS_DOCUMENT, mixpanelPayload);
    }
  }

  async checkCompanyNameAvailability(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/company/availability"
    };
    console.log("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability] API request for Company Name Availability has started", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability][Name: %s] User ID: ", corrId, request.query.name, request.state && request.state.session_token_login_id);
    try {
      const name = request.query.name;
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {headers};
      console.log("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const COMPANY_NAME_UNIQUENESS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.COMPANY_NAME_UNIQUENESS_PATH");
      const url = `${BASE_URL}${COMPANY_NAME_UNIQUENESS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.COMPANY_NAME = name;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;
      mixpanelPayload.CLIENT_TYPE = headers.ROPRO_CLIENT_TYPE;

      const response = await ServerHttp.get(url, options, { name });
      if (response.body && !response.body.unique) {
        if (request.query.clientType === "seller") {
          mixpanelPayload.USER_BLOCKED = true;
          console.log("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability][Name: %s][Email: %s] Company name of seller is not unique, seller will be blocked from proceeding",
            corrId, name, request.state && request.state.session_token_login_id);
        } else {
          console.log("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability][Name: %s] Company name of RO is not unique", corrId, name);
        }
      }
      console.log("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability] API request for Company Name Availability has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::checkCompanyNameAvailability] Error occurred in API request for Company Name Availability:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.CHECK_COMPANY_NAME_AVAILABILILTY, mixpanelPayload);
    }
  }

  async getApplicationDetails(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/org/applicationDetails"
    };
    console.log("[Corr ID: %s][CompanyManagerApi::getApplicationDetails] API request for getting application details has started", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::getApplicationDetails] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        method: "GET",
        headers
      };
      console.log("[Corr ID: %s][CompanyManagerApi::getApplicationDetails] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      let REGISTER_ORG_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.APPLICATION_DETAILS_PATH");
      REGISTER_ORG_PATH && (REGISTER_ORG_PATH = REGISTER_ORG_PATH.replace("__orgId__", request.params.orgId));
      const url = `${BASE_URL}${REGISTER_ORG_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ORG_ID = request.params.orgId;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options);
      console.log("[Corr ID: %s][CompanyManagerApi::getApplicationDetails] API request for getting application details has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::getApplicationDetails] Error occurred in API request for getting application details: ", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.GET_APPLICATION_DETAILS, mixpanelPayload);
    }
  }

  async updateContactInfo(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const payload = request.payload;
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/org/updateContactInfo/{orgId}"
    };
    console.log("[Corr ID: %s][CompanyManagerApi::updateContactInfo] API request for updating contact information.", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::updateContactInfo] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        method: "PUT",
        headers
      };
      console.log("[Corr ID: %s][CompanyManagerApi::updateContactInfo] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      let UPDATE_CONTACT_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.UPDATE_CONTACT_PATH");
      const url = `${BASE_URL}${UPDATE_CONTACT_PATH}`;
      // const url = "http://localhost:8092/ropro/org-service/org/contact-info";

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ORG_ID = request.params.orgId;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.put(url, options, payload);
      console.log("[Corr ID: %s][CompanyManagerApi::updateContactInfo] API request for updating contact information has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::updateContactInfo] Error occurred in API request for updating contact information: ", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.DELETE_CONTACT_INFO, mixpanelPayload);
    }

  }

  async deleteSecondaryContactInfo(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    const payload = request.payload;
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/org/deleteSecondaryContactInfo"
    };
    console.log("[Corr ID: %s][CompanyManagerApi::deleteSecondaryContactInfo] API request for deleting secondary contact information.", corrId);
    console.log("[Corr ID: %s][CompanyManagerApi::deleteSecondaryContactInfo] User ID: ", corrId, request.state && request.state.session_token_login_id);
    try {
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        method: "PUT",
        headers
      };
      console.log("[Corr ID: %s][CompanyManagerApi::deleteSecondaryContactInfo] Fetching CCM dependencies", corrId);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      let DELETE_CONTACT_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.DELETE_CONTACT_PATH");
      // DELETE_CONTACT_PATH && (DELETE_CONTACT_PATH = DELETE_CONTACT_PATH.replace("__orgId__", request.params.orgId));
      const url = `${BASE_URL}${DELETE_CONTACT_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.ORG_ID = request.params.orgId;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.put(url, options, payload);
      console.log("[Corr ID: %s][CompanyManagerApi::deleteSecondaryContactInfo] API request for deleting secondary contact information has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][CompanyManagerApi::deleteSecondaryContactInfo] Error occurred in API request for deleting secondary contact information: ", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.DELETE_CONTACT_INFO, mixpanelPayload);
    }
  }

}

export default new CompanyManagerApi();
