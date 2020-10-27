/* eslint-disable quote-props */

// ======= This configuration is moved to CCM and is maintained here for reference ========== //
const LOGINCONFIG = {
  "TILES": [{
      "svg": "ProblemSolving",
      "header": "What is Brand Portal?",
      "content": {
        "para1": "Brand Portal helps you to:",
        "list1": {
          "type": "ul",
          "steps": [
            "Easily enter your brand information, get it verified, and maintain your brand \"catalog\" on Walmart.",
            "Submit intellectual property claims and track their progress in one dashboard.",
            "Manage both internal and third party authorized reporters in one tool."
          ]
        }
      }
    },
    {
      "svg": "GroupPeople",
      "header": "Who is Brand Portal for?",
      "content": {
        "paraStyleClass": "",
        "para1": "Brand Portal is built for rights owners who would like to protect their intellectual property on Walmart.com.",
        "para2": "In order to use the Brand Portal features, you must have registered trademarks associated with your brands.",
        "para3": "To start the Brand Portal registration process, please click \"Register\" above."
      }
    },
    {
      "svg": "Verify",
      "header": "Register for Brand Portal",
      "content": {
        "para1": "To register for Brand Portal:",
        "list1": {
          "type": "ol",
          "steps": [{
              "partial": {
                "chunk1": "Create an account at ",
                "anchor1": {
                  "href": "/api/falcon/register",
                  "text": "Brand Portal."
                }
              }
            },
            "Fill in your company information.",
            "Fill in your brand information."
          ]
        },
        "para2": "After you submit, we will review and verify the information provided."
      }
    }
  ],

  "FAQ": {
    "header": "Frequently Asked Questions",
    "id": "LoginFAQ",
    "items": [
      {
        "question": "How do I get access to Walmart Brand Portal?",
        "type": "list",
        "answer": {
          "partial1": {
            "chunk1": "Brand Portal is built for rights owners who would like to protect their intellectual property on ",
            "anchor1": {
              "href": "https://www.walmart.com",
              "text": "Walmart.com."
            },
            "chunk2": " To qualify for a Brand Portal account, you will need registered trademarks associated with your brands. We will ask for the following information in the application process:"
          },
          "list": {
            "type": "ol",
            "subType": "1",
            "steps": [{
                "main": "User Information:",
                "subList": {
                  "type": "ul",
                  "subType": "-",
                  "steps": [
                    "First and last name",
                    "Email address"
                  ]
                }
              },
              {
                "main": "Company Information:",
                "subList": {
                  "type": "ul",
                  "subType": "-",
                  "steps": [
                    "Company name",
                    "Company address",
                    "Business registration documents"
                  ]
                }
              },
              {
                "main": "Brand Information:",
                "subList": {
                  "type": "ul",
                  "subType": "-",
                  "steps": [
                    "Brand name",
                    "Registered Trademark Number associated with the brand",
                    "Additional comments about the brand"
                  ]
                }
              }
            ]
          },
          "para2": "You will be granted access to Brand Portal to protect your intellectual property once we have verified the information you submit in your application. "
        }
      },
      {
        "question": "How can I check the status of my Brand Portal application?",
        "type": "simple",
        "answer": {
          "para1": "To see the status of your application, please log into your Brand Portal account. You will see a message with the current application status upon login."
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
        "question": "Can agents or third party vendors that represent a brand get access to Brand Portal?",
        "type": "simple",
        "answer": {
          "para1": "Yes. Rights owners can add additional users, including agents, to their Brand Portal account by inviting a new user and assigning specific roles and brands to the new user."
        }
      },
      {
        "question": "How do I report alleged intellectual property violations if I don't have a Brand Portal account?",
        "type": "simple",
        "answer": {
          "partial1": {
            "anchor1": {
              "href": "https://www.walmart.com",
              "text": "Walmart.com"
            },
            "chunk1": " operates a ",
            "anchor2": {
              "href": "https://help.walmart.com/app/ts",
              "text": "publicly available webform"
            },
            "chunk2": " for reporting alleged instances of intellectual property infringement."
          }
        }
      },
      {
        "question": "What type of claims can I use Brand Portal to report?",
        "type": "simple",
        "answer": {
          "para1": "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit."
        }
      },
      {
        "question": "Is Walmart Brand Portal service available only in the United States?",
        "type": "simple",
        "answer": {
          "para1": "Yes, Brand Portal services are currently offered only for the United States Walmart.com marketplace."
        }
      }
    ]
  }
};

export default LOGINCONFIG;
