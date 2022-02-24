/* eslint-disable no-console */
/* eslint-disable camelcase */
import graphQLUtility from "./../../utility/graphQL-utility";
import Helper from "../../utility/helper";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";
import ServerUtils from "../../utility/server-utils";
import {CONSTANTS} from "../../constants/server-constants";

class DashboardManagerApi {
  constructor() {
    this.name = "DashboardManagerApi";
    this.getDashboard = this.getDashboard.bind(this);
    this.getReportedClaimsType = this.getReportedClaimsType.bind(this);
    this.getTopReportedBrands = this.getTopReportedBrands.bind(this);
    this.getTopReporters = this.getTopReporters.bind(this);
  }

  register(server) {
    return server.route([
      {
        method: "GET",
        // path: "/api/dashboard/{orgId}/{emailId}/{role}",
        path: "/api/dashboard/{params}",
        handler: this.getDashboard
      },
      {
        method: "GET",
        // path: "/api/dashboard/reportedClaimsType/{orgId}/{emailId}/{role}/{dateRange}",
        path: "/api/dashboard/reportedClaimsType/{params}",
        handler: this.getReportedClaimsType
      },
      {
        method: "GET",
        // path: "/api/dashboard/topReportedBrands/{orgId}/{emailId}/{role}/{dateRange}/{claimType}",
        path: "/api/dashboard/topReportedBrands/{params}",
        handler: this.getTopReportedBrands
      },
      {
        method: "GET",
        // path: "/api/dashboard/topReporters/{orgId}/{emailId}/{role}/{dateRange}/{claimType}",
        path: "/api/dashboard/topReporters/{params}",
        handler: this.getTopReporters
      }
    ]);
  }

  // eslint-disable-next-line max-statements
  async getDashboard(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][DashboardManagerApi::getDashboard] API request for Dashboard data has started", corrId);
    console.log("[Corr ID: %s][DashboardManagerApi::getDashboard] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET"
    };
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, "base64").toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params && params.emailId;
      mixpanelPayload.ROLE = params && params.role;
      mixpanelPayload.API_SUCCESS = true;

      console.log("[Corr ID: %s][DashboardManagerApi::getDashboard] Params", corrId, params);
      const response = await graphQLUtility.execute({request, query: "_all", filters: params, headers});
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][DashboardManagerApi::getDashboard] API request for Dashboard data has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][DashboardManagerApi::getDashboard] Error occurred in API request for Dashboard data:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.GET_DASHBORAD_DATA, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async getReportedClaimsType(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][DashboardManagerApi::getReportedClaimsType] API request for Claim Submitted by Type has started", corrId);
    console.log("[Corr ID: %s][DashboardManagerApi::getReportedClaimsType] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      CHART_SELECTED: "CLAIM_SUBMITTED_BY_TYPE"
    };
    try {
      // console.log(request.params)
      const paramsDecoded = request.params && Buffer.from(request.params.params, "base64").toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/reportedClaimsType/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params.emailId;
      mixpanelPayload.ROLE = params && params.role;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.DATA_RANGE = params && params.dateRange;

      console.log("[Corr ID: %s][DashboardManagerApi::getReportedClaimsType] Params", corrId, params);
      const response = await graphQLUtility.execute({request, query: "claimsByType_filtered", filters: params, headers});
      console.log("[Corr ID: %s][DashboardManagerApi::getReportedClaimsType] API request for Claim Submitted by Type has completed", corrId);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][DashboardManagerApi::getReportedClaimsType] Error occurred in API request for Claim Submitted by Type:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.FILTER_SELECTED, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async getTopReportedBrands(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][DashboardManagerApi::getTopReportedBrands] API request for Top Reported Brands has started", corrId);
    console.log("[Corr ID: %s][DashboardManagerApi::getTopReportedBrands] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      CHART_SELECTED: "CLAIM_SUBMITTED_BY_BRAND"
    };
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, "base64").toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/topReportedBrands/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params.emailId;
      mixpanelPayload.ROLE = params.role;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.DATA_RANGE = params && params.dateRange;
      mixpanelPayload.CLAIM_TYPE = params && params.claimType === "__claimType__" ? "ALL" : params.claimType;

      console.log("[Corr ID: %s][DashboardManagerApi::getTopReportedBrands] Params", corrId, params);
      const response = await graphQLUtility.execute({request, query: "claimsByBrands_filtered", filters: params, headers});
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][DashboardManagerApi::getTopReportedBrands] API request for Top Reported brands  has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][DashboardManagerApi::getTopReportedBrands] Error occurred in API request for Top Reported brands:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.FILTER_SELECTED, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async getTopReporters(request, h) {
    const headers = ServerUtils.getHeaders(request);
    const corrId = headers.ROPRO_CORRELATION_ID;
    console.log("[Corr ID: %s][DashboardManagerApi::getTopReporters] API request for Top Reporters has started", corrId);
    console.log("[Corr ID: %s][DashboardManagerApi::getTopReporters] User ID: ", corrId, request.state && request.state.session_token_login_id);
    const mixpanelPayload = {
      METHOD: "GET",
      CHART_SELECTED: "CLAIM_SUBMITTED_BY_USER"
    };
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, "base64").toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/topReporters/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params && params.emailId;
      mixpanelPayload.ROLE = params && params.role;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.DATA_RANGE = params && params.dateRange;
      mixpanelPayload.CLAIM_TYPE = params && params.claimType === "__claimType__" ? "ALL" : params.claimType;

      console.log("[Corr ID: %s][DashboardManagerApi::getTopReporters] Params", corrId, params);
      const response = await graphQLUtility.execute({request, query: "claimsByUsers_filtered", filters: params, headers});
      mixpanelPayload.RESPONSE_STATUS = response.status;
      console.log("[Corr ID: %s][DashboardManagerApi::getTopReporters] API request for Top Reporters has completed", corrId);
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.error("[Corr ID: %s][DashboardManagerApi::getTopReporters] Error occurred in API request for Top Reporters:", corrId, err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.FILTER_SELECTED, mixpanelPayload);
    }
  }
}

export default new DashboardManagerApi();
