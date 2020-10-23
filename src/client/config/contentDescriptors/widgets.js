const WIDGETCONFIG = {
  "SECTIONS": {
    "CLAIM": {
      "API": "/api/claims",
      "ID": "section-claim-widgets",
      "SECTIONCLASSES": "h-claims",
      "SECTIONTITLE": "Claim Summary",
      "SECTIONTITLECLASSES": "h4 mb-3",
      "WIDGETS": [
        {
          "DATAMAPPER": "claim",
          "DETAILS": {
            "layoutClasses": "pr-12",
            "footer": {
              "contentLayout": "text-right",
              "text": "View all claims",
              "href": "/claims"
            }
          },
          "ID": "widget-tabular-claim-summary",
          "PLACEMENT": "1.1.8", // row.order.span
          "TYPE": "CLAIMTABULAR"
        },
        {
          "DATAMAPPER": "claim",
          "DETAILS": {
            "layoutClasses": "pl-12",
            "widgetClasses": "px-4 pb-4 pt-3 mb-4",
            "header": {
              "title": "Reported Claim Types"
            },
            "legend": {
              "indicatorClasses": "rounded mt-3",
              "liClasses": "list-horizontal",
              "ulClasses": "list-unstyled",
              "legendItems": [
                {
                  "name": "Claims",
                  "color": "#007CC6",
                },
                {
                  "name": "Items",
                  "color": "#FFB61A",
                }
              ]
            }
          },
          "ID": "widget-claim-types-grouped-bar",
          "PLACEMENT": "1.2.4", // row.order.span
          "SUBTYPE": "GroupedBarChart",
          "TYPE": "CLAIMTYPEBAR"
        }
      ]
    },
    "BRAND": {
      "API": "/api/brands",
      "ID": "section-brand-widgets",
      "SECTIONCLASSES": "h-brands",
      "SECTIONTITLE": "Brand Summary",
      "SECTIONTITLECLASSES": "h4 mb-3",
      "WIDGETS": [
        {
          "DATAMAPPER": "brand",
          "DETAILS": {
            "layoutClasses": "",
            "body": {
              "content": "Report Walmart.com listings for alleged intellectual property infringement",
            },
            "footer": {
              "text": "View all brands",
              "href": "/brands"
            }
          },
          "ID": "widget-claim-types-stacked-bar",
          "PLACEMENT": "1.1.12", // row.order.span
          "SUBTYPE": "StackedBarChart",
          "TYPE": "BRANDHORIZONTALBAR"
        }
      ]
    }
  },
  "WIDGETCOMMON": {
    "layoutClasses": "",
    "widgetClasses": "widget-border h-100 color-555 shadowed-box",
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
  "WIDGETSALL": {
    "CLAIMTABULAR": {
      "body": {
        "contentClasses": ""
      },
      "footer": {
        "contentClasses": "",
        "icon": "",
        "position": "right",
      },
      "header": {
        "contentClasses": ""
      },
      "tabContainerClasses": "list-unstyled mb-0",
      "tabClasses": "list-horizontal px-4 pt-4 pb-1",
      "tabs": [{"active": true, "id": "open", "label": "Open Claims"}, {"id": "closed", "label": "Closed Claims"}, {"id": "submitted", "label": "Submitted Claims"}],
      "widgetClasses": "",
      "widgetStyle": {}
    },
    "CLAIMTYPEBAR": {
      "actionEnabler": "enableBrandCreate",
      "layoutClasses": "",
      "widgetClasses": "",
      "widgetStyle": {},
      "header": {
        "title": "My Brands",
        "contentClasses": "h5"
      },
      "body": {
        "content": "Add more brands to your Walmart Brand Portal account",
        "contentClasses": ""
      },
      "footer": {
        "text": "Register a New Brand",
        "contentClasses": "",
        "icon": "",
        "href": "/brands",
        "position": "right"
      }
    },
    "BRANDHORIZONTALBAR": {
      "actionEnabler": "enableUserInvite",
      "item": "BRANDS",
      "widgetClasses": "",
      "widgetStyle": {},
      "header": {
        "contentClasses": ""
      },
      "body": {
        "contentClasses": ""
      },
      "footer": {
        "contentClasses": "",
        "icon": "",
        "href": "/brands",
        "position": "right"
      }
    }
  }
}

export default WIDGETCONFIG;
