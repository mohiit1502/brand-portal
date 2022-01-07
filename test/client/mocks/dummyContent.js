/* eslint-disable quote-props */
// =============== This file isn't used anymore and is only retained for reference, this configuration is now available in CCM ================
const dummyContent = {
  "classes": "",
  "content": {
    "partial1": {
      "chunk1": "Status: ",
      "chunk2": [{
        "text": "Under Review",
        "classes": "status-review",
        "key": ["NEW"]
      },
        {
          "text": "Action Required",
          "classes": "status-onhold",
          "key": ["ON_HOLD"]
        },
        {
          "text": "Declined",
          "classes": "status-declined",
          "key": ["REJECTED", "REJECTED_ON_AUDIT"]
        }
      ]
    },
    "para2": {
      "text": "",
      "classes": "mt-3"
    },
    "partial2": {
      "chunk1": [
        {
          "text": "We are unable to verify the information provided in your application. Please refer to the email sent to ",
          "classes": "mt-5",
          "key": ["ON_HOLD"]
        },
        {
          "text": "Your company information and brand details are currently being reviewed. ",
          "classes": "",
          "key": ["NEW"]
        },
        {
          "text": "Your application has been declined. We have sent an email to ",
          "classes": "",
          "key": ["REJECTED", "REJECTED_ON_AUDIT"]
        }
      ],
      "chunk2": [
        {
          "text": "__emailPlaceholder__",
          "classes": "font-weight-bold mt-5",
          "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
          "key": ["ON_HOLD"]
        },
        {
          "text": "Once your application is approved, you will receive a confirmation email at ",
          "classes": "",
          "key": ["NEW"]
        },
        {
          "text": "__emailPlaceholder__ ",
          "classes": "font-weight-bold mt-5",
          "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
          "key": ["REJECTED", "REJECTED_ON_AUDIT"]
        }

      ],
      "chunk3": [
        {
          "text": " for instructions to edit your application.",
          "classes": "mt-5",
          "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
          "key": ["ON_HOLD"]
        },
        {
          "text": "__emailPlaceholder__.",
          "classes": "font-weight-bold mt-5",
          "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
          "key": ["NEW"]
        }

      ],
      "chunk4": [
        {
          "text": "regarding your application. If you believe this is an error, contact ",
          "classes": "mt-5",
          "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
          "key": ["REJECTED", "REJECTED_ON_AUDIT"]
        }
      ],
      "anchor": [{
        "href": "mailto:brandportal@walmart.com",
        "text": "brandportal@walmart.com.",
        "classes": "font-weight-bold mt-5 brand-portal-link-class",
        "key": ["REJECTED", "REJECTED_ON_AUDIT"]
      }
      ]
    },
    "para3": {
      "renderCondition": "{\"keyPath\": \"orgStatus\", \"value\": \"on_hold\"}",
      "text": "Review and confirm that the information in your application is accurate.",
      "classes": "mt-2"
    },
    "para4": {
      "text": "some dummy text with __emailPlaceholder__",
      "classes": "border-bottom mt-4",
      dynamicReplacementConfig: {"__emailPlaceholder__": "test-email"},
    },
    "para5": "text content",
    "list1": {
      type: "ol",
      steps: [
        "text-content",
        {
          "partial": "partial text content"
        },
        {
          "main": "main content",
          "subList": {
            type: "ul",
            "steps": [
              {
                image: ["LoginTypeCta"]
              },
              {
                image: ["LoginTypeCta","FalconLoginForm"]
              }
            ]
          },
        }
      ]
    },
    "header1": {title: "test-header"},
    "buttonsPanel1": {
      buttons: {
        "button1": {
          "classes": "btn btn-primary padded-button",
          "disabled": false,
          "onClick": "handleSubmit",
          "text": "Submit Claim",
          "type": "submit"
        }
      }
    },
    "customDivider1": {},
    "tilesContainer1": {
      tiles: [
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
        }
      ]
    },
    "anchor1": {
      "href": "https://www.walmart.com",
      "text": "Walmart.com"
    },
    nullReturner: ""
  }
};

export default dummyContent;
