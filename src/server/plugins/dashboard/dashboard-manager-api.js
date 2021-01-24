/* eslint-disable no-console */
import graphQLUtility from "./../../utility/graphQL-utility";
import Helper from "../../utility/helper";

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

  async getDashboard(request, h) {
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);
      const response = await graphQLUtility.execute(request, "_all", params);
      // const response = await graphQLUtility.execute(request, "_all", request.params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getReportedClaimsType(request, h) {
    try {
      // console.log(request.params)
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);
      const response = await graphQLUtility.execute(request, "claimsByType_filtered", params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getTopReportedBrands(request, h) {
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);
      const response = await graphQLUtility.execute(request, "claimsByBrands_filtered", params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getTopReporters(request, h) {
    try {
      const paramsDecoded = request.params && Buffer.from(request.params.params, 'base64').toString();
      let params = paramsDecoded && paramsDecoded.split("/");
      params = Helper.arrayToObj(params);
      const response = await graphQLUtility.execute(request, "claimsByUsers_filtered", params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new DashboardManagerApi();
