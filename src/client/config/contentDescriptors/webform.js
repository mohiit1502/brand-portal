const WEBFORMCONFIG = {
  "webform": {
    "titleClass": "ml-8",
    "header": {
      "text": "Intellectual Property (IP) Claim Form",
      "classes": "h4 font-weight-bold"
    },
    "subText": {
      "text": "All of the following fields are required",
      "classes": "d-inline-block mr-3 mb-35rem"
    },
    "disclaimer": {
      "btnText": "View disclaimer",
      "modalDisclaimerText": "To make a claim of IP infringement, you will be required to declare, under penalty of perjury, that the information provided is correct and that you are the IP rights owner or an authorized agent. If the information you submit is inaccurate or incomplete, we may be unable to process or respond to your request. If you have questions about IP or whether your rights have been infringed, consider seeking legal advice.",
      "modalHeaderText": "Disclaimer",
      "actionBtnText": "OK",
      "classes": "d-inline-block anchor-styled mb-35rem"
    },
    "help": {
      "modalHelpText": {
        "content": {
          "partial1": {
            "chunk1": "If you have any issues with filing a claim, please reach out to ",
            "anchor1": {
              "text": "ipinvest@walmart.com",
              "href": "mailto:ipinvest@walmart.com"
            },
            "chunk2": " for further assistance."
          }
        }
      },
      "modalHeaderText": "Help",
      "actionBtnText": "OK",
      "classes": "d-inline-block anchor-styled"
    }
  },
  "ctaPageConfig": {
    "header": {
      "classes": ""
    },
    "content": {
      "tilesContainer1": {
        "classes": "py-4 post-cta-content",
        "tiles": [
          {
            "classes": "mb-4 notification-tile",
            "contentClasses": "border-radius-12px tiles-background-dark with-background pl-7rem py-2rem height-unset",
            "header": {
              "text": "Your IP claim has been successfully submitted",
              "classes": "text-left mb-2 min-height-unset with-notification-check"
            },
            "content": {
              "para1": {
                "text": "We will contact you via email once a decision is made.",
                "classes": "text-left mb-4"
              },
              "buttonsPanel2": {
                "classes": "text-left elevate",
                "buttons": {
                  "button1": {
                    "buttonText": "Submit another claim",
                    "key": "submit_claim",
                    "classes": "anchor-styled background-unset",
                    "onClick": "commonClickHandler",
                    "value": 1
                  }
                }
              }
            }
          }
        ]
      },
      "header1": {
        "title": "Now create a Brand Portal account",
        "classes": "text-center h2 mb-2 font-weight-bold"
      },
      "tilesContainer2": {
        "classes": "py-4 post-cta-content text-center mb-3",
        "tiles": [
          {
            "svg": "GroupPeople",
            "classes": "webform-cta-tile",
            "contentClasses": "tiles-background-dark",
            "header": {
              "text": "Manage everything effortlessly",
              "classes": "tile-header font-size-18"
            },
            "content": {
              "para1": {
                "text": "We’ve designed the Walmart Brand Portal to be an easy-to-use unified hub for managing your registered brands, intellectual property claims, and authorized representatives.",
                "classes": "tile-content font-size-18"
              }
            }
          },
          {
            "svg": "ProblemSolving",
            "classes": "webform-cta-tile",
            "contentClasses": "tiles-background-dark",
            "header": {
              "text": "Protect your brand",
              "classes": "tile-header font-size-18"
            },
            "content": {
              "para1": {
                "text": "Submit intellectual property claims using a simple form.",
                "classes": "tile-content font-size-18"
              }
            }
          },
          {
            "svg": "Verify",
            "classes": "webform-cta-tile",
            "contentClasses": "tiles-background-dark",
            "header": {
              "text": "Track your claims",
              "classes": "tile-header font-size-18"
            },
            "content": {
              "para1": {
                "text": "Monitor your claims in one single dashboard, then delve into individual claims to check on their progress and results.",
                "classes": "tile-content font-size-18"
              }
            }
          }
        ]
      },
      "buttonsPanel1": {
        "classes": "col mb-5 text-center buttonsPanel1 post-cta-content",
        "buttons": {
          "anchor1": {
            "href": "/",
            "text": "Create an account",
            "classes": "btn btn-primary py-3 px-5"
          },
          "anchor2": {
            "href": "https://marketplace.walmart.com/brand-portal/",
            "text": "Learn More",
            "classes": "btn btn-outline-primary py-3 px-5"
          }
        }
      }
    }
  }
};

export default WEBFORMCONFIG;
