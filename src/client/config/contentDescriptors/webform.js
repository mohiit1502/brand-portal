const WEBFORMCONFIG = {
    landingPageConfig: {
      content: {
        header1: {
          title: "Walmart Brand Portal",
          classes: "content-header h5"
        },
        para1: {
          text: "Walmart respects the intellectual property (\"IP\") rights of others and understand that Brand owners freque stay alert and react quickly to protect their intellectual property.",
          classes: "message-content" 
        },
        para2: {
          text: "With the new Walmart Brand Portal, you can manage your various brands, submit multiple types of intellec property claims, and track claim status, all within one easy to use interface. Register for the Walmart Brand today to simplify your brand management of Walmart.com.",
          classes: "message-content"
        },
        buttonsPanel1: {
          classes: "text-right pr-3  py-3",
          buttons: {
            button1: {
              buttonText: "Register",
              key: "register",
              classes: "btn btn-sm  btn-primary"
            }
          }
        },
        header2: {
          title: "DMCA IP Claim Form",
          classes: "content-header h5"
        },
        para3: {
          text: `Walmart has set up the online IP Claim Form for owners of IP rights to report legitimate claims of infringement as to
          items listed on Walmart.com, including claims of copyright, trademark, patent, publicity and counterfeit. Walmart
          strives to promptly process and investigate such claims and take appropriate actions under applicable laws.`,
          classes: "message-content"
        },
        para4: {
          text: `To make a claim of IP infringement, you will be required to declare, under penalty of perjury, that the information provided is correct and that you are the IP rights owner or an authorized agent. To understand what constitutes infringement, continue reading. To make an IP claim now, click here. If the information you submit is inaccurate or incomplete, we may be unable to process or respond to your request. If you have questions about IP or whether your
          rights have been infringed, consider seeking legal advice.`,
          classes: "message-content"
        },
        buttonsPanel2: {
          classes: "text-right pt-3 pr-3 pb-4",
          buttons: {
            button2: {
              buttonText: "Submit IP claim",
              key: "submit_claim",
              classes: "btn btn-sm  btn-primary"
            }
          }
        }
      }
    },
    ctaPageConfig: {
      content: {
        para1: {
          text: "Thank you for your claim of IP infringement. We will review your request and let you know wher decision has been made.",
          classes: "pl-5 h4 pb-5 message-content"
        },
        customDivider1: {
          classes: "customDivider1"
        },
        header1: {
          title: "Walmart Brand Portal",
          classes: "text-center h1 pb-3 pt-4 font-weight-bold"
        },
        customDivider2: {
          classes: "customDivider2"
        },
        para2: {
                text: "Manage your brands and intellectual property rights with a powerful new tool",
                classes: "h4 pt-3 pb-5 col-8 d-inline-block post-cta-content"
        },
        buttonsPanel1: {
          classes: "py-3 col-4 text-right d-inline-block  buttonsPanel1 post-cta-content",
          buttons: {
            button1: {
              buttonText: "Learn More",
              key: "learn_more_1",
              classes: "btn learn-more btn-sm"
            },
            button2: {
              buttonText: "Get Started",
              key: "get_started_1",
              classes: "btn get-started btn-sm"
            }
          }
        },
        tilesContainer: {
          classes: "py-4 post-cta-content",
          tiles: [
            {
              svg: "ProblemSolving",
              header: "Manage everything effortlessly",
              content: {
                para1: {
                  text: "We've designed the Walmart Brand Portal to be an easy-to-use unified hub for managing your registered brands, intellectual property claims, and authorized representatives.",
                  classes: "tile-content"
                },
                anchor1: {
                  "href": "https://brandportal.walmart.com/",
                  "text": "Learn More",
                  "classes": "anchor"
                }
              }
            },
            {
              svg: "GroupPeople",
              header: "Protect your brand",
              content: {
                para1: {
                  text: "Submit intellectual property claims using a simple form.",
                  classes: "tile-content"
                },
                anchor1: {
                  "href": "https://brandportal.walmart.com/",
                  "text": "Learn More",
                  "classes": "anchor"
                }
              }
            },
            {
                svg: "GroupPeople",
                header: "Track your claims",
                content: {
                  para1: {
                    text: "Monitor your claims in one sin dashboard, then delve into indiv claims to check on their progres results",
                    classes: "tile-content"
                  },
                  anchor1: {
                    "href": "https://brandportal.walmart.com/",
                    "text": "Learn More",
                    "classes": "anchor"
                  }
                }
            }
          ]
      },
      buttonsPanel2: {
        classes: "text-right py-5 pl-5 post-cta-content",
        buttons: {
          button1: {
            buttonText: "Submit a New IP claim",
            key: "submit_claim",
            classes: "btn submit_claim btn-sm",
            onClick: "commonClickHandler"
          }
        }
      }
      }
    }
  };

export default WEBFORMCONFIG;
