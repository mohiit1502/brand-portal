/* eslint-disable quote-props */

// ======= This configuration is moved to CCM and is maintained here for reference ========== //
const LOGINCONFIG = {
  "TILES": [
    {
      "svg": "ProblemSolving",
      "header": "What are the benefits of Walmart Brand Portal?",
      "content": {
        "list1": {
          "type": "ol",
          "steps": [
            "Streamlined IP claim submission process",
            "Comprehensive claim tracking dashboard",
            "Centralized user management services"
          ]
        }
      }
    },
    {
      "svg": "GroupPeople",
      "header": "Who is eligible to use Walmart Brand Portal?",
      "content": {
        "list1": {
          "type": "ol",
          "steps": [
            "Rights owners with registered trademarks",
            "Authorized third-party brand protection agencies",
            "Authorized legal representatives"
          ]
        }
      }
    },
    {
      "svg": "Verify",
      "header": "What do I need to get started?",
      "content": {
        "list1": {
          "type": "ol",
          "steps": [
            "Company information",
            "Active trademark registration number",
            "Verifiable email address"
          ]
        }
      }
    }
  ],
  "FAQ": {
    "header": "Frequently Asked Questions",
    "id": "LoginFAQ",
    "items": [
      {
        "question": "Why Walmart Brand Portal?",
        "type": "simple",
        "answer": {
          "partial1": {
            "chunk1": "Walmart takes allegations of intellectual property infringement seriously. We built the Walmart Brand Portal with the goal to enable rights owners to better manage and protect their intellectual property rights on ",
            "anchor1": {
              "href": "https://www.walmart.com",
              "text": "Walmart.com"
            },
            "chunk2": ", and to build a trusted online platform for our customers."
          }
        }
      },
      {
        "question": "How can I check the status of my Walmart Brand Portal application?",
        "type": "simple",
        "answer": {
          "para1": "To see the status of your application, please log into your Walmart Brand Portal account. You will see a message with the current application status upon login."
        }
      },
      {
        "question": "What type of claims can I submit using Walmart Brand Portal?",
        "type": "simple",
        "answer": {
          "partial1": {
            "chunk1": "You can report any legitimate claims of intellectual property infringement for items listed on ",
            "anchor1": {
              "href": "https://www.walmart.com",
              "text": "Walmart.com"
            },
            "chunk2": ", including claims of copyright, trademark, patent, and counterfeit."
          },
          "para2": "Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements. "
        }
      },
      {
        "question": "Is Walmart Brand Portal available only in the United States?",
        "type": "simple",
        "answer": {
          "partial1": {
            "chunk1": "Yes, Walmart Brand Portal services are currently offered only for the United States ",
            "anchor1": {
              "href": "https://www.walmart.com",
              "text": "Walmart.com"
            },
            "chunk2": " marketplace."
          }
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
        "question": "How do I submit intellectual property claims if I don't have a Walmart Brand Portal account?",
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
      }
    ]
  }
}

export default LOGINCONFIG;
