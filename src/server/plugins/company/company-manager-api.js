/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import ServerUtils from "../../utility/server-utils";
import mixpanel from "../../utility/mixpanelutility";
import { MIXPANEL_CONSTANTS } from "../../constants/mixpanel-constants";

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
      }
    ]);
  }

  /* eslint-disable complexity */
  async registerOrganization(request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/org/register"
    };
    console.log("[CompanyManagerApi::registerOrganization] API request for Register organization has started");
    console.log("[CompanyManagerApi::registerOrganization] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const headers = ServerUtils.getHeaders(request);
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        method: "POST",
        headers
      };
      console.log("[CompanyManagerApi::registerOrganization] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
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

      const response = await ServerHttp.post(url, options, payload);
      console.log("[CompanyManagerApi::registerOrganization] API request for Register organization has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[CompanyManagerApi::registerOrganization] Error occured in API request for Register organization:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.REGISTER_ORGANIZATION, mixpanelPayload);
    }
  }

  async checkTrademarkValidity(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: `/api/brand/trademark/validity/${request.params && request.params.trademarkNumber}`
    };
    console.log("[CompanyManagerApi::checkTrademarkValidity] API request for Trademark Validity has started");
    console.log("[CompanyManagerApi::checkTrademarkValidity] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const headers = ServerUtils.getHeaders(request);
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };

      console.log("[CompanyManagerApi::checkTrademarkValidity] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
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
      console.log("[CompanyManagerApi::checkTrademarkValidity] API request for Trademark Validity has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[CompanyManagerApi::checkTrademarkValidity] Error occured in API request for Trademark Validity:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.CHECK_TRADEMARK_VALIDITY, mixpanelPayload);
    }
  }

  async uploadAdditionalDocument(request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/company/uploadAdditionalDocument"
    };
    console.log("[CompanyManagerApi::uploadAdditionalDocument] API request for Upload Additional Document has started");
    console.log("[CompanyManagerApi::uploadAdditionalDocument] User ID: ", request.state && request.state.session_token_login_id);
    try {

      const headers = ServerUtils.getDocumentHeaders(request);

      const options = {
        headers
      };
      console.log("[CompanyManagerApi::uploadAdditionalDocument] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const file = request.payload.file;
      const filename = file.hapi.filename;
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
      console.log("[CompanyManagerApi::uploadAdditionalDocument] API request for Upload Additional Document has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[CompanyManagerApi::uploadAdditionalDocument] Error occured in API request for Upload Additional Document:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_ADDITIONAL_DOCUMENT, mixpanelPayload);
    }
  }

  async uploadBusinessDocument(request, h) {
    const mixpanelPayload = {
      METHOD: "POST",
      API: "/api/company/uploadBusinessDocument"
    };
    console.log("[CompanyManagerApi::uploadBusinessDocument] API request for Upload Business document has started");
    console.log("[CompanyManagerApi::uploadBusinessDocument] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const headers = ServerUtils.getDocumentHeaders(request);
      const options = {
        headers
      };
      const file = request.payload.file;
      const filename = file.hapi.filename;
      const fd = new FormData();

      fd.append("file", file, { filename });
      console.log("[CompanyManagerApi::uploadBusinessDocument] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const BUSINESS_DOC_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BUSINESS_DOC_PATH");
      const url = `${BASE_URL}${BUSINESS_DOC_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.FILE_NAME = filename;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.postAsFormData(url, options, fd);
      console.log("4. In CMA - post-request - Got Response from FIle Upload ====== ", response);
      console.log("[CompanyManagerApi::uploadBusinessDocument] API request for Upload Business document has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log("5. In CMA - Error caught ======== ", err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[CompanyManagerApi::uploadBusinessDocument] Error occured in API request for Upload Business document:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.UPLOAD_BUSINESS_DOCUMENT, mixpanelPayload);
    }
  }

  async checkCompanyNameAvailability(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/company/availability"
    };
    console.log("[CompanyManagerApi::checkCompanyNameAvailability] API request for Company Name Avaialability has started");
    console.log("[CompanyManagerApi::checkCompanyNameAvailability] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const name = request.query.name;

      const headers = ServerUtils.getHeaders(request);
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        headers
      };

      console.log("[CompanyManagerApi::checkCompanyNameAvailabililty] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
      const BASE_URL = await ServerUtils.ccmGet(request, "BRAND_CONFIG.BASE_URL");
      const COMPANY_NAME_UNIQUENESS_PATH = await ServerUtils.ccmGet(request, "BRAND_CONFIG.COMPANY_NAME_UNIQUENESS_PATH");
      const url = `${BASE_URL}${COMPANY_NAME_UNIQUENESS_PATH}`;

      mixpanelPayload.URL = url;
      mixpanelPayload.distinct_id = headers && headers.ROPRO_USER_ID;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.COMPANY_NAME = name;
      mixpanelPayload.ROPRO_CORRELATION_ID = headers && headers.ROPRO_CORRELATION_ID;

      const response = await ServerHttp.get(url, options, { name });
      console.log("[CompanyManagerApi::checkCompanyNameAvailabililty] API request for Company Name Avaialability has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[CompanyManagerApi::checkCompanyNameAvailabililty] Error occured in API request for Company Name Avaialability:", err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.CHECK_COMPANY_NAME_AVAILABILILTY, mixpanelPayload);
    }
  }

  async getApplicationDetails(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      API: "/api/org/applicationDetails"
    };
    console.log("[CompanyManagerApi::getApplicationDetails] API request for getting application details has started");
    console.log("[CompanyManagerApi::getApplicationDetails] User ID: ", request.state && request.state.session_token_login_id);
    try {
      const headers = ServerUtils.getHeaders(request);
      if (!headers.ROPRO_CLIENT_TYPE) {
        headers.ROPRO_CLIENT_TYPE = request.query.clientType;
      }
      const options = {
        method: "GET",
        headers
      };
      console.log("[CompanyManagerApi::getApplicationDetails] ROPRO_CORRELATION_ID:", headers.ROPRO_CORRELATION_ID);
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
      console.log("[CompanyManagerApi::getApplicationDetails] API request for getting application details has completed");
      return h.response(response.body).code(response.status);
    } catch (err) {
      const dummyResponse = {
        orgStatus: "ON_HOLD",
        orgId: "14afba06-a560-40a1-93aa-f0ae6d44ebe6",
        brandId: "14afba06-a560-40a1-93aa-f0ae6d44ebe6",
        company: {
            name: "Subhadeep-demo003",
            address: "Bangalore",
            city: "Bangalore",
            state: "CA",
            zip: "17122",
            countryCode: "US",
            businessRegistrationDoc: null,
            additionalDoc: null
        },
        brand: {
            name: "Test-brand#4",
            trademarkNumber: "5912022",
            comments: "eeee",
            usptoUrl: null,
            usptoVerification: "VALID"
        },
        businessRegistrationDocList: [
            {
                documentId: "7438c5c7-dde9-4ac7-a286-41a65cedc510",
                documentName: "Document2.pdf",
                createTS: "2021-11-30T11:57:15.774Z",
                uploadedToServiceNow: false
            }
        ],
        additionalDocList: [
            {
                documentId: "7438c5c7-dde9-4ac7-a286-41a65cedc510",
                documentName: "DocumentOld.pdf",
                createTS: "2021-10-30T11:54:58.730Z",
                uploadedToServiceNow: false
            },
            {
                documentId: "7438c5c7-dde9-4ac7-a286-41a65cedc510",
                documentName: "DocumentNew.pdf",
                createTS: "2021-11-30T11:57:15.774Z",
                uploadedToServiceNow: false
            }
        ]
    };
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log("[CompanyManagerApi::getApplicationDetails] Error occured in API request for getting application details: ", err);
      // return h.response(dummyResponse).code(200);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_MANAGER_API.GET_APPLICATION_DETAILS, mixpanelPayload);
    }
  }

}

export default new CompanyManagerApi();
