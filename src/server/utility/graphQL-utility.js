import ServerUtils from "./server-utils";
import ServerHttp from "./ServerHttp";
import DASHBOARDQUERY from "../queries/dashboard";
import Helper from "./helper";

class GraphQLUtility {

  constructor() {
    this.gqlQueries = {...DASHBOARDQUERY};
    this.requireProcessing = {
      "topReportedBrands": {"brandName": "root", "totalClaim": "root", "Trademark": "claimTypes.claimType", "Counterfeit": "claimTypes.claimType", "Patent": "claimTypes.claimType", "Copyright": "claimTypes.claimType"},
      "topReporters": {"email": "root", "firstName": "root", "lastName": "root", "totalClaim": "root", "Trademark": "claimTypes.claimType", "Counterfeit": "claimTypes.claimType", "Patent": "claimTypes.claimType", "Copyright": "claimTypes.claimType"},
      "reportedClaimsType": {"_all": "reportedClaimsTypeCount"}
    };
  }

  async execute(request, query, filters) {
    try {
      const headers = ServerUtils.getHeaders(request);
      const payload = this.getPayload(query, filters);
      // console.log(payload);
      const options = {
        headers
      };
      const BASE_URL = request.app.ccmGet("DASHBOARD_CONFIG.BASE_URL");
      const GRAPHQL_ENDPOINT = request.app.ccmGet("DASHBOARD_CONFIG.GRAPHQL_ENDPOINT");
      const url = `${BASE_URL}${GRAPHQL_ENDPOINT}`;
      let response =  await ServerHttp.post(url, options, payload);
      this.processResponse(response, filters);
      // console.log(response.body.data && response.body.data.topReportedBrands.claimCounts);
      // console.log(response.body.errors);
      // console.log(response.body.data.topReportedBrands.claimCounts[0].claimTypes);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  processResponse(response, filters) {
    if (response.body.errors && response.body.errors.length > 0) {
      return response;
    }
    response.body.data && Object.keys(response.body.data).map(itemKey => {
      if (Object.keys(this.requireProcessing).includes(itemKey)) {
        const item = response.body.data[itemKey];
        const structure = this.requireProcessing[itemKey];
        let updatedItem = [];
        if (structure) {
          const keys = Object.keys(structure);
          if (keys && keys.length > 0 && keys[0] === "_all") {
            updatedItem = item[structure["_all"]];
          } else {
            item && item.claimCounts && item.claimCounts.length > 0 && item.claimCounts.forEach(subItem => {
              const updatedSubItem = {};
              keys.forEach(key => updatedSubItem[key] = this.mapValue(key, structure, subItem))
              filters && filters.claimType && filters.claimType !== "__claimType__" && (updatedSubItem[filters.claimType] = updatedSubItem.totalClaim);
              updatedItem.push(updatedSubItem);
            })
          }
          // console.log(item)
          // console.log(item && item.claimCounts && item.claimCounts[0].claimTypes)
          response.body.data[itemKey] = updatedItem;
        }
      }
    })
  }

  mapValue(key, structure, item) {
    const foundIn = structure[key];
    if (foundIn === "root") {
      return item[key];
    } else {
      const path = foundIn.split(".");
      const parent = item[path[0]];
      if (parent && typeof parent === "object") {
        if (parent.length) {
          const matched = parent.find(subItem => subItem[path[1]] === key);
          return matched ? matched.count : 0;
        }
      } else {
        return 0;
      }
    }
  }

  getPayload(query, filters) {
    const payload = {};
    let allQuery = "query{";
    if (query === "_all") {
      allQuery = allQuery + Object.keys(this.gqlQueries).reduce((allQueries, queryName) => queryName.endsWith("_default") ? allQueries + this.gqlQueries[queryName] : allQueries, "");
    } else {
      allQuery = allQuery + this.gqlQueries[query];
    }
    allQuery =  allQuery + "}"
    filters.fromDate = "1970-01-01";
    filters.toDate = "";
    allQuery = this.addFilters(allQuery, filters, query)
    payload.query = allQuery;
    return payload;
  }

  addFilters(query, filters, queryName) {
    filters.orgId && (query = query.replace(/__orgId__/g, filters.orgId));
    filters.emailId && (query = query.replace(/__emailId__/g, filters.emailId));
    filters.role && (query = query.replace(/__role__/g, filters.role));
    if (queryName !== "_all") {
      const {fromDate, toDate} = Helper.getDateRange(filters.dateRange);
      // const now = new Date();
      // const toDate = JSON.stringify(now).substring(1, 11);
      // now.setDate(now.getDate() - 1);
      // const fromDate = JSON.stringify(now).substring(1, 11);
      query = query.replace(/__fromDate__/g, fromDate);
      query = query.replace(/__toDate__/g, toDate);
      query = query.replace(/__claimFilter__/g, filters.claimType !== "__claimType__" ? `claimType: ${filters.claimType}`: "");
    } else {
      const now = new Date();
      now.setDate(now.getDate() + 1)
      const toDate = JSON.stringify(now).substring(1, 11);
      now.setDate(now.getDate() - 30);
      const fromDate = JSON.stringify(now).substring(1, 11);
      query = query.replace(/__fromDate__/g, fromDate);
      query = query.replace(/__toDate__/g, toDate);
      query = query.replace(/__claimFilter__/g, filters.claimType && filters.claimType !== "__claimType__" ? `claimType: ${filters.claimType}`: "");
    }
    return query;
  }
}

export default new GraphQLUtility();
