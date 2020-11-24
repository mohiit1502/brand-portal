const WIDGETCONFIG = {
  "API": "/api/dashboard/__orgId__",
  "WIDGETS": [
    {
      "DATAMAPPER": "claim",
      "DETAILS": {
        "layoutClasses": "pr-12",
        "header": {
          "title": "Claims Summary"
        },
        "body": {
          "href": "/claims",
          "items": [
            {
              "name": "All",
              "mapper": "totalItemsFetched"
            },
            {
              "name": "In Progress",
              "mapper": "workFlowCounts.status",
              "value": "NEW"
            },
            {
              "name": "Closed",
              "mapper": "workFlowCounts.status",
              "value": "REJECTED"
            }
          ]
        },
        "footer": {
          "contentLayout": "text-right",
          "text": "Submit New Claim"
        },
        "templateName": "NewClaimTemplate"
      },
      "ID": "widget-claim-summary",
      "PLACEMENT": "1.1.4", // row.order.span
      "TYPE": "SUMMARY"
    },
    {
      "DATAMAPPER": "brand",
      "DETAILS": {
        "layoutClasses": "px-12",
        "widgetClasses": "px-4 pb-4 pt-3 mb-4",
        "header": {
          "title": "Brands Summary"
        },
        "body": {
          "href": "/brands",
          "items": [
            {
              "name": "All",
              "mapper": "totalItemsFetched"
            },
            {
              "name": "Pending",
              "mapper": "workFlowCounts.status",
              "value": "NEW"
            },
            {
              "name": "Verified",
              "mapper": "workFlowCounts.status",
              "value": "ACCEPTED"
            }
          ]
        },
        "footer": {
          "contentLayout": "text-right",
          "text": "Register New Brand"
        },
        "templateName": "NewBrandTemplate"
      },
      "ID": "widget-brand-summary",
      "PLACEMENT": "1.2.4", // row.order.span
      "SUBTYPE": "GroupedBarChart",
      "TYPE": "SUMMARY"
    },
    {
      "DATAMAPPER": "user",
      "DETAILS": {
        "layoutClasses": "pl-12",
        "header": {
          "title": "Users Summary"
        },
        "body": {
          "href": "/users",
          "items": [
            {
              "name": "All",
              "mapper": "totalItemsFetched"
            },
            {
              "name": "Pending",
              "mapper": "workFlowCounts.status",
              "value": "INVITED"
            },
            {
              "name": "Active",
              "mapper": "workFlowCounts.status",
              "value": "ACTIVE"
            }
          ]
        },
        "footer": {
          "text": "Invite New User",
          "href": "/brands"
        },
        "templateName": "CreateUserTemplate"
      },
      "ID": "widget-user-summary",
      "PLACEMENT": "1.3.4", // row.order.span
      "SUBTYPE": "StackedBarChart",
      "TYPE": "SUMMARY"
    },
    {
      "DATAMAPPER": "claimsByType",
      "API": "/api/dashboard/reportedClaimsType/__orgId__/__dateRange__",
      "DATAKEY": "reportedClaimsType",
      "DETAILS": {
        "layoutClasses": "pr-12",
        "header": {
          "title": "Claim Submitted by Type"
        },
        "filters": [
          {
            "classes": "col-6 pr-375",
            "name": "dateRange",
            "placeholder": "Date Range"
          }
        ],
        "chart": {
          "key": "claimType",
          "group": [
            {
              "name": "claimsCount",
              "colorMapper": "Claims"
            },
            {
              "name": "itemsCount",
              "colorMapper": "Items"
            }
          ]
        },
        "legend": {
          "indicatorClasses": "rounded",
          "liClasses": "list-horizontal",
          "ulClasses": "list-unstyled",
          "legendItems": [
            {
              "name": "Claims",
              "color": "#e68677",
            },
            {
              "name": "Items",
              "color": "#bbb",
            }
          ]
        }
      },
      "ID": "widget-claims-by-type",
      "PLACEMENT": "2.1.4", // row.order.span
      "SUBTYPE": "GroupedBarChart",
      "TYPE": "VERTICALGROUPEDBAR"
    },
    {
      "DATAMAPPER": "claimsByBrands",
      "API": "/api/dashboard/topReportedBrands/__orgId__/__dateRange__/__claimType__",
      "DATAKEY": "topReportedBrands",
      "DETAILS": {
        "layoutClasses": "px-12",
        "header": {
          "title": "Claim Submitted by Brand"
        },
        "filters": [
          {
            "classes": "col-6 pr-375",
            "name": "dateRange",
            "placeholder": "Date Range"
          },
          {
            "classes": "col-6 pl-375",
            "name": "claimType",
            "placeholder": "Claim Type",
            "backendMapper": {
              "all": "__claimType__",
              "trademark": "Trademark",
              "patent": "Patent",
              "counterfeit": "Counterfeit",
              "copyright": "Copyright",
            }
          },
        ],
        "chart": {
          "layerKey": "brandName"
        },
        "legend": {
          "legendItems": [
            {
              "name": "Counterfeit",
              "color": "#ffb61a",
            },
            {
              "name": "Trademark",
              "color": "#007cc6",
            },
            {
              "name": "Copyright",
              "color": "#38b996",
            },
            {
              "name": "Patent",
              "color": "#ac38b9",
            }
          ]
        }
      },
      "ID": "widget-claims-by-brand",
      "PLACEMENT": "2.2.4", // row.order.span
      "SUBTYPE": "StackedBarChart",
      "TYPE": "HORIZONTALSTACKEDBAR"
    },
    {
      "DATAMAPPER": "claimsByUsers",
      "API": "/api/dashboard/topReporters/__orgId__/__dateRange__/__claimType__",
      "DATAKEY": "topReporters",
      "DETAILS": {
        "layoutClasses": "pl-12",
        "header": {
          "title": "Claim Submitted by User"
        },
        "chart": {
          "layerKey": "firstName,lastName"
        },
        "filters": [
          {
            "classes": "col-6 pr-375",
            "name": "dateRange",
            "placeholder": "Date Range"
          },
          {
            "classes": "col-6 pl-375",
            "name": "claimType",
            "placeholder": "Claim Type",
            "backendMapper": {
              "all": "__claimType__",
              "trademark": "Trademark",
              "patent": "Patent",
              "counterfeit": "Counterfeit",
              "copyright": "Copyright",
            }
          },
        ],
        "body": {},
        "legend": {
          "legendItems": [
            {
              "name": "Counterfeit",
              "color": "#ffb61a",
            },
            {
              "name": "Trademark",
              "color": "#007cc6",
            },
            {
              "name": "Copyright",
              "color": "#38b996",
            },
            {
              "name": "Patent",
              "color": "#ac38b9",
            }
          ]
        }
      },
      "ID": "widget-claims-by-user",
      "PLACEMENT": "2.3.4", // row.order.span
      "SUBTYPE": "StackedBarChart",
      "TYPE": "HORIZONTALSTACKEDBAR"
    }
  ],
  "WIDGETCOMMON": {
    "layoutClasses": "mb-4",
    "widgetClasses": "widget-border color-555 shadowed-box",
    // "widgetStyle": {"flex": "0 0 30%", "maxWidth": "30%", "minHeight": "15rem"},
    "widgetStyle": {},
    "contentLayout": "",
    "header": {
      "contentLayout": "",
      "contentClasses": "font-weight-bold"
    },
    "body": {
      "contentLayout": "py-3",
      "contentClasses": "h5 px-3 font-weight-bold override-body-style"
    },
    "footer": {
      "contentLayout": "mx-4 py-3",
      "contentClasses": "font-weight-bold"
    }
  },
  "WIDGETTYPES": {
    "SUMMARY": {
      "contentClasses": "border",
      "header": {
        "layoutClasses": "px-4 pt-3 mb-0 header-grey",
        "contentClasses": ""
      },
      "body": {
        "contentClasses": "",
        "layoutClasses": "px-4 pt-4 line-height-reset"
      },
      "footer": {
        "layoutClasses": "d-block py-875",
        "contentClasses": "border-top text-center footer-text font-size-16 font-weight-bold",
        "position": "center",
      }
    },
    "VERTICALGROUPEDBAR": {
      "layoutClasses": "",
      "widgetClasses": "",
      "widgetStyle": {},
      "header": {
        "layoutClasses": "px-4 pt-3 mb-0 header-grey line-height-reset h-10",
        "contentClasses": "h5"
      },
      "body": {
        "layoutClasses": "px-4 pt-3 h-90",
        "contentClasses": "",
        "legend": {
          "indicatorClasses": "rounded",
          "liClasses": "list-horizontal font-size-10 mr-3",
          "ulClasses": "list-unstyled d-inline-block mb-0"
        }
      }
    },
    "HORIZONTALSTACKEDBAR": {
      "widgetClasses": "",
      "widgetStyle": {},
      "header": {
        "layoutClasses": "px-4 pt-3 mb-0 header-grey line-height-reset h-10",
        "contentClasses": ""
      },
      "body": {
        "layoutClasses": "px-4 pt-3 h-90",
        "contentClasses": "",
        "legend": {
          "indicatorClasses": "rounded",
          "liClasses": "list-horizontal font-size-10 mr-3",
          "ulClasses": "list-unstyled d-inline-block mb-0"
        }
      }
    }
  }
}

export default WIDGETCONFIG;
