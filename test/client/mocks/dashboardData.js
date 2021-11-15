const dashboardData = {
  errors: [],
  data: {
    brandsInfo: {
      totalItemsFetched: 20,
      workFlowCounts: [
        {
          status: "NEW",
          count: 3
        },
        {
          status: "ACCEPTED",
          count: 2
        },
        {
          status: "ACCEPTED_ON_AUDIT",
          count: 1
        },
        {
          status: "REJECTED",
          count: 14
        }
      ]
    },
    claimsInfo: {
      totalItemsFetched: 38,
      workFlowCounts: [
        {
          status: "NEW",
          count: 3
        },
        {
          status: "ACCEPTED",
          count: 4
        },
        {
          status: "REJECTED",
          count: 31
        }
      ]
    },
    usersInfo: {
      totalItemsFetched: 63,
      workFlowCounts: [
        {
          status: "DISABLE",
          count: 2
        },
        {
          status: "ACTIVE",
          count: 24
        },
        {
          status: "INVITED",
          count: 32
        },
        {
          status: "TOU_NOT_ACCEPTED",
          count: 5
        }
      ]
    },
    reportedClaimsType: [
      {
        claimType: "Trademark",
        claimsCount: 1,
        itemsCount: 1
      }
    ],
    topReportedBrands: [
      {
        brandName: "test-bubble-candy",
        totalClaim: 1,
        Trademark: 1,
        Counterfeit: 0,
        Patent: 0,
        Copyright: 0
      }
    ],
    topReporters: [
      {
        email: "wm.ropro+candy@gmail.com",
        firstName: "Super",
        lastName: "Admin Edited",
        totalClaim: 1,
        Trademark: 1,
        Counterfeit: 0,
        Patent: 0,
        Copyright: 0
      }
    ]
  },
  extensions: null,
  dataPresent: true
};

export default dashboardData;
