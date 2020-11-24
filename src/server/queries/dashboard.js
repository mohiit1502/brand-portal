const DASHBOARDQUERY = {
  brandSummary: "brandsInfo (orgId: \"__orgId__\") { totalItemsFetched workFlowCounts { status count } }",
  claimSummary: "claimsInfo (orgId: \"__orgId__\") { totalItemsFetched workFlowCounts { status count } }",
  userSummary: "usersInfo (orgId: \"__orgId__\") { totalItemsFetched workFlowCounts { status count } }",
  claimsByType_filtered: "reportedClaimsType (fromDate: \"__fromDate__\" toDate: \"__toDate__\" orgId: \"__orgId__\") { reportedClaimsTypeCount {claimType claimsCount itemsCount } }",
  claimsByBrands_filtered: "topReportedBrands( fromDate: \"__fromDate__\" toDate: \"__toDate__\" orgId: \"__orgId__\" __claimFilter__ recordCount:5  ) { claimCounts { brandName totalClaim claimTypes { claimType  count} } }",
  claimsByUsers_filtered: "topReporters( fromDate: \"__fromDate__\"  toDate: \"__toDate__\" orgId: \"__orgId__\" __claimFilter__ recordCount: 8 ) { claimCounts { email firstName lastName totalClaim claimTypes { claimType  count} } }",
  claimsByType: "reportedClaimsType (orgId: \"__orgId__\") { reportedClaimsTypeCount {claimType claimsCount itemsCount } }",
  claimsByBrands: "topReportedBrands( orgId: \"__orgId__\" recordCount:5  ) { claimCounts { brandName totalClaim claimTypes { claimType  count} } }",
  claimsByUsers: "topReporters( orgId: \"__orgId__\" recordCount: 8 ) { claimCounts { email firstName lastName totalClaim claimTypes { claimType  count} } }"
};

export default DASHBOARDQUERY;
