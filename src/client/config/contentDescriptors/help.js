/* eslint-disable quote-props */
// =============== This file isn't used anymore and is only retained for reference, this configuration is now available in CCM ================
const HELPCONFIG = {
    "header": "Walmart Brand Portal Help Center",
    "categoryHeader": "Help Topics",
    "categories": {
      "faq": {
        "categoryText": "Frequently Asked Questions"
      },
      "user": {
        "categoryText": "User Management"
      },
      "brand": {
        "categoryText": "Brand Management"
      },
      "claim": {
        "categoryText": "Claims Submission"
      },
      "contact": {
        "categoryText": "Contact Us"
      }
    },
    "content": {
      "faq": {
        "header": "Frequently Asked Questions",
        "id": "query_faq",
        "simple": false,
        "items": [
          {
            "question": "Can I add third-party representatives to my Walmart Brand Portal account?",
            "type": "simple",
            "answer": {
              "para1": "Yes. Rights owners can add additional users, including third-party users, to their Walmart Brand Portal account by inviting a new user and assigning specific roles and brands to the new user."
            }
          },
          {
            "question": "How do I access my account if the admin of the account is no longer with the company?",
            "type": "simple",
            "answer": {
              "partial1": {
                "chunk1": "Please reach out to our support team at: ",
                "anchor1": {
                  "href": "mailto:brandportal@walmart.com",
                  "text": "brandportal@walmart.com"
                },
                "chunk2": ". Please be sure to include information about your account, along with details regarding your issue."
              }
            }
          },
          {
            "question": "How many brands can I add to my Walmart Brand Portal account?",
            "type": "simple",
            "answer": {
              "para1": "There is no limit to the number of brands you can add under your Walmart Brand Portal account. You can add additional brands at any time by heading to the \"My Brands\" section, clicking \"New Brand\", and entering your brand information. The submitted information will be verified by our team, then added to your account once ownership is confirmed."
            }
          },
          {
            "question": "Are WIPO or EUIPO trademarks accepted by Walmart Brand Portal?",
            "type": "simple",
            "answer": {
              "para1": "Walmart Brand Portal currently only accepts trademarks registered with the United States Patent and Trademark Office (USPTO)."
            }
          },
          {
            "question": "What type of claims can I use Walmart Brand Portal to report?",
            "type": "simple",
            "answer": {
              "para1": "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit.",
              "para2": "Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements."
            }
          },
          {
            "question": "How do I check the status of an IP claim?",
            "type": "list",
            "answer": {
              "para1": "Once you submit an IP claim through Walmart Brand Portal, your claim will appear in the claim dashboard under \"My Claims\". To see the status of your claim, check the \"status\" column, or click on the claim number to see additional information.",
              "para2": "Your claim will show one of the following in the \"claim status\" section:",
              "list": {
                "type": "ul",
                "subType": "1",
                "steps": [
                  "Submitted: Your claim was submitted, and is pending review",
                  "In progress: Your claim is currently under review",
                  "Closed: Your claim is closed, and additional details were shared to the reporter's email address"
                ]
              }
            }
          },
          {
            "question": "Can I retract a claim I made on Walmart Brand Portal?",
            "type": "simple",
            "answer": {
              "partial1": {
                "chunk1": "Please reach out to our support team at ",
                "anchor1": {
                  "href": "mailto:brandportal@walmart.com",
                  "text": "brandportal@walmart.com"
                },
                "chunk2": " to submit a retraction. Please be sure to include the original claim number that you'd like to retract."
              }
            }
          },
          {
            "question": "Is Walmart Brand Portal available only in the United States?",
            "type": "simple",
            "answer": {
              "para1": "Yes, Walmart Brand Portal services are currently offered only for the United States Walmart.com marketplace."
            }
          },
          {
            "question": "How can I get help from the Walmart team if I'm experiencing bugs or have questions about the tool?",
            "type": "simple",
            "answer": {
              "partial1": {
                "chunk1": "Please reach out to our support team at: ",
                "anchor1": {
                  "href": "mailto:brandportal@walmart.com",
                  "text": "brandportal@walmart.com"
                },
                "chunk2": " and include information about your account, along with details regarding your issue."
              }
            }
          }
        ]
      },
      "user": {
        "header": "User Management",
        "id": "query_user",
        "simple": false,
        "items": [
          {
            "question": "How to add additional users",
            "type": "listWithImages",
            "answer": {
              "para1": "In Walmart Brand Portal, you can add and manage multiple users to help represent your brands. Users can include third party vendors. To add additional users to your Walmart Brand Portal account, follow these steps:",
              "list": {
                "type": "ol",
                "subType": "1",
                "steps": [
                  {
                    "main": "Login to your Walmart Brand Portal account",
                    "image": [
                      "Login"
                    ]
                  },
                  {
                    "main": "Head to \"User List\" section",
                    "image": [
                      "UserList"
                    ]
                  },
                  {
                    "main": "Click \"Invite User\"",
                    "image": [
                      "InviteUser"
                    ]
                  },
                  {
                    "main": "Enter information about the user:",
                    "subList": {
                      "type": "ul",
                      "subType": "-",
                      "steps": [
                        "Select the type of user",
                        "First and last name",
                        "Email",
                        "Select role and assign brands (see \"How to manage user roles and permissions\")"
                      ]
                    },
                    "image": [
                      "InviteUserForm"
                    ]
                  }
                ]
              },
              "para2": "An email will be sent to the invited user, and they will be asked to verify their email address and create a login password. Once these steps are completed, the invited user will be added to the Walmart Brand Portal account."
            }
          },
          {
            "question": "How to manage user roles and permissions",
            "type": "simple",
            "answer": {
              "para1": "You have the flexibility to assign particular roles and permissions to your users. There are three types of roles:",
              "para2": "Super Admin: The super admin will have access to all features within Walmart Brand Portal, including adding additional admins and reporters, adding new brands, submitting IP claims, and keeping track of all submitted claims in the claims dashboard.",
              "para3": "Admin: The admin will have access to most features within Walmart Brand Portal, including adding additional reporters, adding new brands, submitting IP claims, and keeping track of all submitted claims in the claims dashboard.",
              "para4": "Reporter: The reporter role will be able to submit IP claims and see the claims dashboard."
            }
          }
        ]
      },
      "brand": {
        "header": "Brand Management",
        "id": "query_brand",
        "simple": false,
        "items": [
          {
            "question": "How to add new brands to your Walmart Brand Portal account",
            "type": "listWithImages",
            "answer": {
              "para1": "Once your information has been verified and you've gained access to Walmart Brand Portal, you can add more brands to your account. You can do this at any time by taking the following steps:",
              "list": {
                "type": "ol",
                "subType": "1",
                "steps": [
                  {
                    "main": "Login to your Walmart Brand Portal account",
                    "image": [
                      "Login"
                    ]
                  },
                  {
                    "main": "Head to \"My Brands\" section",
                    "image": [
                      "BrandList"
                    ]
                  },
                  {
                    "main": "Click \"New Brand\"",
                    "image": [
                      "CreateBrandButton"
                    ]
                  },
                  {
                    "main": "Enter your brand information:",
                    "subList": {
                      "type": "ul",
                      "subType": "-",
                      "steps": [
                        "Brand name",
                        "Registered Trademark Number associated with the brand",
                        "Additional comments about the brand"
                      ]
                    },
                    "image": [
                      "CreateBrandForm"
                    ]
                  },
                  {
                    "main": "Once submitted, Walmart will verify that the trademark is associated with your company."
                  }
                ]
              }
            }
          },
          {
            "question": "How to manage your brands",
            "type": "simple",
            "answer": {
              "para1": "Once a brand has been added to your Walmart Brand Portal account, you have the ability to manage the brand status, and assign specific users to the brand.",
              "para2": "Suspend/Activate: If you would like to stop submitting IP claims against a particular brand, you have the option to suspend the brand. This means that the suspended brand will no longer surface in the drop-down menu during IP claims submission. Should you need to activate the brand in the future, you will also have the ability to do so in the \"My Brands\" section.",
              "para3": "Assign/Unassign: You can assign specific users to be able to submit IP claims against your brands. In order to assign a brand to a user, go to the \"User List\" section, click on the user's name, and assign a brand (or all brands)."
            }
          }
        ]
      },
      "claim": {
        "header": "Claims Submission",
        "id": "query_claim",
        "simple": false,
        "items": [
          {
            "question": "How to submit claims",
            "type": "list",
            "answer": {
              "partial1": {
                "chunk1": "If you find any listings on ",
                "anchor1": {
                  "href": "https://www.walmart.com",
                  "text": "Walmart.com"
                },
                "chunk2": " that you believe violate your intellectual property, you can submit a claim through Walmart Brand Portal. You can follow these steps to report alleged intellectual property infringements on ",
                "anchor2": {
                  "href": "https://www.walmart.com",
                  "text": "Walmart.com."
                }
              },
              "list": {
                "type": "ol",
                "subType": "1",
                "steps": [
                  {
                    "main": "Login to your Walmart Brand Portal Account"
                  },
                  {
                    "main": "Head to \"My Claims\" section"
                  },
                  {
                    "main": "Click \"New Claim\""
                  },
                  {
                    "main": "Fill out the New Claim form:",
                    "subList": {
                      "type": "ul",
                      "subType": "-",
                      "steps": [
                        "Select the brand name",
                        "Select the infringement type (Trademark, Copyright, Counterfeit, Patent)",
                        "Enter the trademark registration number, if applicable",
                        "Enter the item URL(s)",
                        "Select the Seller Name",
                        "Enter comments regarding your claim",
                        "Confirm legal statements"
                      ]
                    }
                  }
                ]
              }
            }
          },
          {
            "question": "How to check your claim history",
            "type": "simple",
            "answer": {
              "para1": "Once you've submitted claims through Walmart Brand Portal, you will be able to see your claim history, along with the status of each of your claims. Head to \"My Claims\" section to see all of the claims you've submitted through your Walmart Brand Portal account. You can filter your list by claim number, claim type, brand, who submitted the claim, claim date, and the status.",
              "para2": "To see additional details about the claims you submitted, click on the claim number. A pop-up will appear that will show you the following information: ",
              "list": {
                "type": "ul",
                "subType": "1",
                "steps": [
                  "Claim type",
                  "Brand information",
                  "Name of the reporter",
                  "Claim date",
                  "Reported items",
                  "Reported sellers",
                  "Claim comments",
                  {
                    "main": "Claim status",
                    "subList": {
                      "type": "ul",
                      "subType": "-",
                      "steps": [
                        "Submitted: Your claim was submitted, and is pending review",
                        "In progress: Your claim is currently under review",
                        "Closed: Your claim is closed, and additional claim details were shared to the reporter's email address"
                      ]
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      "contact": {
        "header": "How to reach out to us",
        "id": "query_user",
        "simple": true,
        "type": "simple",
        "answer": {
          "partial1": {
            "chunk1": "If you have additional questions or require support, please reach out to us: ",
            "anchor1": {
              "text": "brandportal@walmart.com",
              "href": "mailto:brandportal@walmart.com"
            }
          }
        }
      }
    }
  };

export default HELPCONFIG;
