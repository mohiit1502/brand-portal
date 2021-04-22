/* eslint-disable no-console */
import graphQLUtility from "./../../utility/graphQL-utility";
import Helper from "../../utility/helper";
import mixpanel from "../../utility/mixpanelutility";
import {MIXPANEL_CONSTANTS} from "../../constants/mixpanel-constants";

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
    const mixpanelPayload = {
      METHOD: "GET"
    };
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params.emailId;
      mixpanelPayload.Email = params.emailId;
      mixpanelPayload.ROLE = params.role;
      mixpanelPayload.API_SUCCESS = true;

      const response = await graphQLUtility.execute(request, "_all", params);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      // const response = await graphQLUtility.execute(request, "_all", request.params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.GET_DASHBORAD_DATA, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async getReportedClaimsType(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      CHART_SELECTED: "CLAIM_SUBMITTED_BY_TYPE"
    };
    try {
      // console.log(request.params)
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/reportedClaimsType/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params.emailId;
      mixpanelPayload.Email = params.emailId;
      mixpanelPayload.ROLE = params.role;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.DATA_RANGE = params.dateRange;

      const response = await graphQLUtility.execute(request, "claimsByType_filtered", params);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      console.log(err);
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.FILTER_SELECTED, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async getTopReportedBrands(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      CHART_SELECTED: "CLAIM_SUBMITTED_BY_BRAND"
    };
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/topReportedBrands/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params.emailId;
      mixpanelPayload.Email = params.emailId;
      mixpanelPayload.ROLE = params.role;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.DATA_RANGE = params.dateRange;
      mixpanelPayload.CLAIM_TYPE = params.claimType === "__claimType__" ? "ALL" : params.claimType;

      const response = await graphQLUtility.execute(request, "claimsByBrands_filtered", params);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.FILTER_SELECTED, mixpanelPayload);
    }
  }

  // eslint-disable-next-line max-statements
  async getTopReporters(request, h) {
    const mixpanelPayload = {
      METHOD: "GET",
      CHART_SELECTED: "CLAIM_SUBMITTED_BY_USER"
    };
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);

      mixpanelPayload.API =  `/api/dashboard/topReporters/${paramsDecoded}`;
      mixpanelPayload.distinct_id = params.emailId;
      mixpanelPayload.Email = params.emailId;
      mixpanelPayload.ROLE = params.role;
      mixpanelPayload.API_SUCCESS = true;
      mixpanelPayload.DATA_RANGE = params.dateRange;
      mixpanelPayload.CLAIM_TYPE = params.claimType === "__claimType__" ? "ALL" : params.claimType;

      const response = await graphQLUtility.execute(request, "claimsByUsers_filtered", params);
      mixpanelPayload.RESPONSE_STATUS = response.status;
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
      mixpanelPayload.RESPONSE_STATUS = err.status;
      return h.response(err).code(err.status);
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.DASHBOARD_API.FILTER_SELECTED, mixpanelPayload);
    }
  }
}

export default new DashboardManagerApi();
