const WEBFORMCONFIG = {
    "landingPageConfig": {
      "header": {
        "text": "Submit IP Claims",
        "classes": ""
      },
      "content": {
        "header1": {
          "title": "Walmart Brand Portal",
          "classes": "content-header mp-blue h5"
        },
        "para1": {
          "text": "Walmart respects the intellectual property (\"IP\") rights of others and understand that Brand owners frequenlty need to stay alert and react quickly to protect their intellectual property.",
          "classes": "message-content" 
        },
        "para2": {
          "text": "With the new Walmart Brand Portal, you can manage your various brands, submit multiple types of intellectual property claims, and track claim status, all within one easy to use interface. Register for the Walmart Brand today to simplify your brand management of Walmart.com.",
          "classes": "message-content"
        },
        "buttonsPanel1": {
          "classes": "text-right pr-3 mr-5 py-3",
          "buttons": {
            "anchor1": {
              "href": "/api/falcon/register",
              "text": "Register",
              "classes": "btn btn-sm  btn-primary mp-blue"
            }
          }
        },
        "header2": {
          "title": "DMCA IP Claim Form",
          "classes": "content-header mp-blue h5"
        },
        "para3": {
          "text": `Walmart has set up the online IP Claim Form for owners of IP rights to report legitimate claims of infringement as to
          items listed on Walmart.com, including claims of copyright, trademark, patent, publicity and counterfeit. Walmart
          strives to promptly process and investigate such claims and take appropriate actions under applicable laws.`,
          "classes": "message-content"
        },
        "para4": {
          "text": `To make a claim of IP infringement, you will be required to declare, under penalty of perjury, that the information provided is correct and that you are the IP rights owner or an authorized agent. To understand what constitutes infringement, continue reading. To make an IP claim now, click here. If the information you submit is inaccurate or incomplete, we may be unable to process or respond to your request. If you have questions about IP or whether your
          rights have been infringed, consider seeking legal advice.`,
          "classes": "message-content"
        },
        "buttonsPanel2": {
          "classes": "text-right pt-3 mr-5 pr-3 pb-5 mb-5",
          "buttons": {
            "button2": {
              "buttonText": "Submit IP Claim",
              "key": "submit_claim",
              "classes": "btn btn-sm  btn-primary mp-blue",
              "onClick": "commonClickHandler",
              "value": "1"
            }
          }
        }
      }
    },
    "ctaPageConfig": {
      "header": {
        "text": "DMCA Claim Form",
        "classes": ""
      },
      "content": {
        "para1": {
          "text": "Thank you for your claim of IP infringement. We will review your request and let you know when a decision has been made.",
          "classes": "h4 pb-4"
        },
        "customDivider1": {
          "classes": "customDivider1"
        },
        "header1": {
          "title": "Walmart Brand Portal",
          "classes": "text-center h1 pb-3 pt-4 font-weight-bold"
        },
        "customDivider2": {
          "classes": "customDivider2"
        },
        "para2": {
                "text": "Manage your brands and intellectual property rights with a powerful new tool",
                "classes": "h4 mp-blue pt-3 pb-2 col-8 d-inline-block font-weight-bold post-cta-content message"
        },
        "buttonsPanel1": {
          "classes": "col-4 text-right d-inline-block  buttonsPanel1 post-cta-content",
          "buttons": {
            "anchor1": {
              "href": "https://marketplace.walmart.com/brand-portal/",
              "text": "Learn More",
              "classes": "btn learn-more btn-sm pt-2"
            },
            "anchor2": {
              "href": "/",
              "text": "Get Started",
              "classes": "btn get-started mp-blue btn-sm pt-2"
            }
          }
        },
        "tilesContainer": {
          "classes": "py-4 post-cta-content text-center",
          "tiles": [
            {
              "svg": "ProblemSolving",
              "header": {
                "text": "Manage everything effortlessly",
                "classes": "tile-header"
              },
              "content": {
                "para1": {
                  "text": "We’ve designed the Walmart Brand Portal to be an easy-to-use unified hub for managing your registered brands, intellectual property claims, and authorized representatives.",
                  "classes": "tile-content"
                },
                "anchor1": {
                  "href": "https://marketplace.walmart.com/brand-portal/",
                  "text": "Learn More",
                  "image": "ArrowRight"
                }
              }
            },
            {
              "svg": "GroupPeople",
              "header": {
                "text": "Protect your brand",
                "classes": "tile-header"
              },
              "content": {
                "para1": {
                  "text": "Submit intellectual property claims using a simple form.",
                  "classes": "tile-content"
                },
                "anchor1": {
                  "href": "https://marketplace.walmart.com/brand-portal/",
                  "text": "Learn More",
                  "image": "ArrowRight"
                }
              }
            },
            {
                "svg": "Verify",
                "header": {
                  "text": "Track your claims",
                  "classes": "tile-header"
                },
                "content": {
                  "para1": {
                    "text": "Monitor your claims in one single dashboard, then delve into individual claims to check on their progress and results.",
                    "classes": "tile-content"
                  },
                  "anchor1": {
                    "href": "https://marketplace.walmart.com/brand-portal/",
                    "text": "Learn More",
                    "image": "ArrowRight"
                  }
                }
            }
          ]
      },
      "buttonsPanel2": {
        "classes": "text-right py-5 mb-5 pl-5 post-cta-content",
        "buttons": {
          "button1": {
            "buttonText": "Submit a New IP Claim",
            "key": "submit_claim",
            "classes": "btn submit_claim btn-sm pb-5",
            "onClick": "commonClickHandler",
            "value": 1
          }
        }
      }
      }
    },
    "webform": {
      "titleClass": "ml-8",
      "header": {
        "text": "DMCA Claim Form",
        "classes": ""
      }
    }
  };

export default WEBFORMCONFIG;
