/* eslint-disable no-console */
import graphQLUtility from "./../../utility/graphQL-utility";

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
        path: "/api/dashboard/{orgId}",
        handler: this.getDashboard
      },
      {
        method: "GET",
        path: "/api/dashboard/reportedClaimsType/{orgId}/{dateRange}",
        handler: this.getReportedClaimsType
      },
      {
        method: "GET",
        path: "/api/dashboard/topReportedBrands/{orgId}/{dateRange}/{claimType}",
        handler: this.getTopReportedBrands
      },
      {
        method: "GET",
        path: "/api/dashboard/topReporters/{orgId}/{dateRange}/{claimType}",
        handler: this.getTopReporters
      }
    ]);
  }

  async getDashboard(request, h) {
    try {
      const response = await graphQLUtility.execute(request, "_all", request.params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getReportedClaimsType(request, h) {
    try {
      console.log(request.params)
      const response = await graphQLUtility.execute(request, "claimsByType_filtered", request.params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getTopReportedBrands(request, h) {
    try {
      const response = await graphQLUtility.execute(request, "claimsByBrands_filtered", request.params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }

  async getTopReporters(request, h) {
    try {
      const response = await graphQLUtility.execute(request, "claimsByUsers_filtered", request.params);
      return h.response(response.body).code(response.status);
    } catch (err) {
      console.log(err);
      return h.response(err).code(err.status);
    }
  }
}

export default new DashboardManagerApi();
