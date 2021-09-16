/* eslint-disable camelcase */

const DASHBOARDQUERY = {
  brandSummary_default: "brandsInfo (orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\") { totalItemsFetched workFlowCounts { status count } }",
  claimSummary_default: "claimsInfo (orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\") { totalItemsFetched workFlowCounts { status count } }",
  userSummary_default: "usersInfo (orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\") { totalItemsFetched workFlowCounts { status count } }",
  claimsByType_filtered_default: "reportedClaimsType (fromDate: \"__fromDate__\" toDate: \"__toDate__\" orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\") { reportedClaimsTypeCount {claimType claimsCount itemsCount } }",
  claimsByBrands_filtered_default: "topReportedBrands( fromDate: \"__fromDate__\" toDate: \"__toDate__\" orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\" __claimFilter__ recordCount: 8 ) { claimCounts { brandName totalClaim claimTypes { claimType  count} } }",
  claimsByUsers_filtered_default: "topReporters( fromDate: \"__fromDate__\"  toDate: \"__toDate__\" orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\" __claimFilter__ recordCount: 8 ) { claimCounts { email firstName lastName totalClaim claimTypes { claimType  count} } }",
  claimsByType_filtered: "reportedClaimsType (fromDate: \"__fromDate__\" toDate: \"__toDate__\" orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\") { reportedClaimsTypeCount {claimType claimsCount itemsCount } }",
  claimsByBrands_filtered: "topReportedBrands( fromDate: \"__fromDate__\" toDate: \"__toDate__\" orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\" __claimFilter__ recordCount: 8  ) { claimCounts { brandName totalClaim claimTypes { claimType  count} } }",
  claimsByUsers_filtered: "topReporters( fromDate: \"__fromDate__\"  toDate: \"__toDate__\" orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\" __claimFilter__ recordCount: 8 ) { claimCounts { email firstName lastName totalClaim claimTypes { claimType  count} } }",
  claimsByType: "reportedClaimsType (orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\") { reportedClaimsTypeCount {claimType claimsCount itemsCount } }",
  claimsByBrands: "topReportedBrands( orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\" recordCount: 8  ) { claimCounts { brandName totalClaim claimTypes { claimType  count} } }",
  claimsByUsers: "topReporters( orgId: \"__orgId__\" emailId: \"__emailId__\" role: \"__role__\" recordCount: 8 ) { claimCounts { email firstName lastName totalClaim claimTypes { claimType  count} } }"
};

export default DASHBOARDQUERY;
