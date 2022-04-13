/* eslint-disable quote-props */

const MODALSMETA = {
  "MODALSCONFIG": {
    "PORTAL_REGISTRATION": {
      "CODE": 1
    },
    "SELLER_WELCOME_PROMPT": {
      "BODY_CONTENT_CLASSES": "text-left px-5",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset modal-md",
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para1": {
            "text": "Welcome __firstNamePlaceholder__ __lastNamePlaceholder__",
            "dynamicReplacementConfig": {"__firstNamePlaceholder__": "profile.firstName", "__lastNamePlaceholder__": "profile.lastName"},
            "classes": "font-weight-bold mt-2 mb-4 mx-4 font-size-28 text-center"
          },
          "para2": {
            "text": "We will be using the information in your Seller Center account to set up your Brand Portal account.",
            "classes": "mx-3 font-size-16 text-center"
          },
          "para3": {
            "text": "Please confirm the information of your company and provide the details of your registered trademark.",
            "classes": "mx-3 mt-5 font-size-16 text-center"
          },
          "para4": {
            "text": "The information provided will be verified by our team. You will receive a confirmation email once your application status has been updated.",
            "classes": "mx-4 mt-5 font-size-16 text-center"
          }
        }
      },
      "IMAGE": "ProblemSolving",
      "PRIMARY_ACTION": {
        "text": "Start",
        "action": "hideModal",
        "classes": "my-4"
      },
      "TYPE": "CTA"
    },
    "APPLICATION_SUBMITTED": {
      "BODY_CONTENT_CLASSES": "text-left",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset",
      "SUBTITLE": {
        "content": {
          "para1": {
            "text": "You can check the status of your application anytime by logging into your Brand Portal account.",
            "classes": "font-size-16 mx-5"
          }
        }
      },
      "MESSAGE": {
        "classes": "",
        "content": {
        }
      },
      "TITLE": {
        "classes": "justify-content-center",
        "content": {
          "para": {
            "text": "Application Submitted",
            "classes": "h3 mx-5 px-5 mb-2 font-weight-bold"
          }
        }
      },
      "HEIGHT": 100,
      "IMAGE": "GreenCircleWhiteTick",
      "PRIMARY_ACTION": {
        "text": "OK",
        "action": "refreshAndHideModal"
      },
      "TYPE": "CTA"
    },
    "APPLICATION_INFORMATION": {
      "CODE": [2, 8],
      "BODY_CONTENT_CLASSES": "ml-5 text-left pl-5",
      "BODY_CLASSES": "px-5 modal-background modal-height",
      "MODAL_DIALOG_CLASSES": "width-unset modal-xl ",
      "MESSAGE": {
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
                "text": "We have sent an email to ",
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
              "text": " regarding your application. Please follow the instructions in the email and make any necessary changes to your application.",
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
          "partial3": {
            "chunk5": [
              {
                "text": "If you believe this is an error, contact ",
                "classes": "mt-5",
                "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
                "key": ["ON_HOLD"]
              }
            ],
            "anchor": [{
                "href": "mailto:brandportal@walmart.com",
                "text": "brandportal@walmart.com.",
                "classes": "font-weight-bold mt-5 brand-portal-link-class",
                "key": ["ON_HOLD"]
              }
            ]
          },
          "para4": {
            "text": "",
            "classes": "border-bottom my-3"
          }
        }
      },
      "TITLE": {
        "classes": "col ml-3 pl-5",
        "content": {
          "para": {
            "text": "__businessName__",
            "dynamicReplacementConfig": {"__businessName__": "org.name"},
            "classes": "text-left h3 pl-0 font-weight-bold col-9"
          },
          "button1": {
            "icon": "EditOutlinedIcon",
            "classes": "col btn btn-primary px-0",
            "buttonText": "Edit Application",
            "onClick": "dispatchUserProfile",
            "renderCondition": "{\"keyPath\": \"orgStatus\", \"value\": \"on_hold\"}"
          }
        }
      },
      "CONTENT_COMPONENT": "ApplicationDetails",
      "CONTENT_COMPONENT_PROP": "updateCompanyDetails",
      "TYPE": "CTA"
    },
    "EMAIL_VERIFIED": {
      "BODY_CONTENT_CLASSES": "text-left px-5",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset modal-md",
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para3": {
            "text": "Your email address has been verified",
            "classes": "font-weight-bold mt-2 mb-4 mx-4 font-size-28 text-center"
          },
          "para1": {
            "text": "Next, we need to verify that you are the owner of the intellectual property rights that you wish to enforce.",
            "classes": "mx-4 font-size-16"
          },
          "list": {
            "type": "ul",
            "subType": "1",
            "liClasses": "font-size-16 mt-4",
            "steps": [
              "The information provided will be verified by our team.",
              "You will receive a confirmation email once your application has been submitted. We will keep you updated on the status of your application via email."
            ]
          }
        }
      },
      "IMAGE": "ProblemSolving",
      "PRIMARY_ACTION": {
        "text": "Start",
        "action": "hideModal",
        "classes": "my-4"
      },
      "TYPE": "CTA"
    },
    "DELETE_CONTACT": {
      "BODY_CLASSES": "text-center",
      "BODY_CONTENT_CLASSES": "px-5 font-size-15",
      "HEADER": "Delete Public Contact Information",
      "SUBTITLE": {
        "content": {
          "para1": {
            "text": "If you delete the Public contact information, the Super Admin's ",
            "classes": "mx-2 text-center mb-0 mt-4 font-size-16"
          },
          "para2": {
            "text": "contact information will be shared by default.",
            "classes": "mx-2 text-center pb-5 font-size-16"
          }
        }
      },
      "PRIMARY_ACTION": {
        "text": "Delete",
        "classes": "text-right float-right px-3",
        "containerClasses": "p-3",
        "action": "navigation",
        "actionParam": "https://seller.walmart.com"
      },
      "ADDITIONAL_ACTION": {
        "text": "Back",
        "classes": "mt-0 d-inline-block text-right mr-3 blue",
        "action": "closeModal"
      },
      "FOOTER_CLASSES": "margin-unset bg-blue mt-4",
      "TYPE": "NOTIFICATION"

    },
    "GO_TO_USER_PROFILE": {
      "BODY_CLASSES": "text-center",
      "BODY_CONTENT_CLASSES": "px-5 font-size-15",
      "HEADER": "Welcome to Walmart Brand Portal!",
      "SUBTITLE": {
        "content": {
          "para1": {
            "text": "You can update the contact information for your ",
            "classes": "mx-2 text-center mb-0 mt-4 font-size-16"
          },
          "para2": {
            "text": "company on the User Profile page.",
            "classes": "mx-2 text-center pb-5 font-size-16"
          }
        }
      },
      "HEIGHT": "110",
      "IMAGE": "ProblemSolving",
      "PRIMARY_ACTION": {
        "text": "Go to your Profile",
        "classes": "text-right float-right px-3",
        "containerClasses": "p-3",
        "action": "goToUserProfile",
        "actionParam": "https://seller.walmart.com"
      },
      "ADDITIONAL_ACTION": {
        "text": "I'll do it later",
        "classes": "mt-0 d-inline-block text-right mr-3 blue",
        "action": "hideModal"
      },
      "FOOTER_CLASSES": "margin-unset bg-blue mt-4",
      "TYPE": "NOTIFICATION"
    },
    "LOGOUT": {
      "BODY_CONTENT_CLASSES": "text-left",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset",
      "SUBTITLE": {
        "classes": "mx-4",
        "content": {
          "para1": {
            "text": "You will lose your progress and the information already entered will not be saved.",
            "classes": "font-size-16 mx-5"
          }
        }
      },
      "MESSAGE": {
        "classes": "",
        "content": {
        }
      },
      "TITLE": {
        "content": {
          "para": {
            "text": "Are you sure you want to logout?",
            "classes": "h3 mx-auto mb-2 font-weight-bold"
          }
        }
      },
      "HEIGHT": 100,
      "PRIMARY_ACTION": {
        "text": "Logout",
        "action": "logout"
      },
      "ADDITIONAL_ACTION": {
        "action": "hideModal",
        "text": "Go Back"
      },
      "TYPE": "CTA"
    },
    "DASHBOARD_MODAL": {
      "BODY_CONTENT_CLASSES": "text-left px-5",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset modal-md",
      "HEADER": "Welcome to Walmart Brand Portal!",
      "IMAGE": "ProblemSolving",
      "SUBTITLE": {
        "content": {
          "para1": {
            "text": "You can update the contact information for your ",
            "classes": "mx-2"
          },
          "para2": {
            "text": "company on the User Profile page.",
            "classes": "mx-2"
          }
        }
      },
      "PRIMARY_ACTION": {
        "text": "Go to your Profile",
        "classes": "text-right float-right px-3",
        "containerClasses": "p-3",
        "action": "goToUserProfile",
        "actionParam": "https://seller.walmart.com"
      },
      "ADDITIONAL_ACTION": {
        "text": "I'll do it later",
        "classes": "mt-0 d-inline-block text-right mr-3",
        "action": "closeModal"
      },
      "FOOTER_CLASSES": "margin-unset bg-blue mt-4",
      "TYPE": "NOTIFICATION"
    },
    "PORTAL_DASHBOARD": {
      "CODE": 4
    },
    "USER_ACCESS_REVOKED": {
      "CODE": 16,
      "IMAGE": "RedCircleCross",
      "MESSAGE": "Your account access has been revoked for security reasons",
      "TITLE": {
        "ROW_CLASSES": "justify-content-center",
      "content": {
        "para": {
          "text": "Access Denied",
          "classes": "font-weight-bold"
        }
      }
    }
    },
    "REQUEST_ACCESS": {
      "CODE": 32,
      "IMAGE": "GreenCircleCheck",
      "MESSAGE": "Access Request, awaiting approval.",
      "TITLE": "Access requested"
    },
    "USER_VERIFICATION": {
      "CODE": 64,
      "MODAL_DIALOG_CLASSES": "width-medium",
      "IMAGE": "EmailIconWithYellowMessage",
      "HEIGHT": "120",
      "SUBTITLE": {
        "content": {
          "para2": {
            "text": "To move forward with your application, we need to verify the email address associated with your account.",
            "classes": "font-size-15 mx-5"
          }
        }
      },
      "MESSAGE": {
        "classes": "background-lightblue mx-2 my-3 px-5 py-3 font-size-16",
        "content": {
          "partial1": {
            "chunk1": "We've sent a verification email to ",
            "chunk2": {
              "text": "__emailPlaceholder__",
              "classes": "font-weight-bold",
              "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"}
            },
            "chunk3": ". Follow the link in the email to complete verification."
          }
        }
      },
      "TITLE": {
        "ROW_CLASSES": "justify-content-center",
        "content": {
          "para": {
            "text": "Please verify your email address",
            "classes": "h5 mx-5 px-3 mb-4 font-weight-bold"
          }
        }
      },
      "ADDITIONAL_ACTION": {
        "action": "resendInvite",
        "text": "Resend Verification Email",
        "actionHelpText": {
          "text": "No email received?",
          "classes": "font-size-14"
        }
      },
      "NO_PRIMARY_ACTION": true

    },
    "TOU_VERIFICATION": {
      "CODE": 128,
      "FILE": "test.pdf",
      "GENERIC": true,
      "TEMPLATE": "TouTemplate"
    },
    "ACCOUNT_LINKING": {
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para1": {
            "text": "Confirm and connect your accounts to continue:",
            "classes": "subtitle mx-4"
          },
          "para2": {
            "text": "The Walmart Seller Center credentials you used to log in are associated with the company details existing in your Brand Portal account for:",
            "classes": "subtitle mx-4"
          },
          "para3": {
            "text": "[__namePlaceholder__]",
            "dynamicReplacementConfig": {"__namePlaceholder__": "profile.organization.name"},
            "classes": "font-weight-bold subtitle mt-2 mb-4 mx-4"
          },
          "para4": {
            "text": "In order to access the Brand Portal dashboard, you must connect your accounts to override your initial Brand Portal login credentials.",
            "classes": "subtitle mx-3"
          }
        }
      },
      "CODE": 256,
      "IMAGE": "ShieldTick",
      "TITLE": {
        "classes": "justify-content-center",
        "content": {
          "para": {
            "text": "Link your accounts to continue"
          }
        }
      },
      "PRIMARY_ACTION": {
        "text": "Connect accounts",
        "action": "linkAccounts"
      },
      "ADDITIONAL_ACTION": {
        "text": "Log out",
        "classes": "mp-blue",
        "action": "logout"
      },
      "TYPE": "CTA"
    },
    "ACCOUNT_LINKING_CONFIRM": {
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para1": {
            "text": "Linking account needs only to occur once, but cannot be undone. If you decide to do this later, you will be logged out.",
            "classes": "subtitle mx-5"
          }
        }
      },
      "IMAGE": "ShieldTick",
      "TITLE": "Are you sure?",
      "PRIMARY_ACTION": {
        "text": "Yes, link my accounts",
        "action": "linkAccounts"
      },
      "ADDITIONAL_ACTION": {
        "text": "No, I will do this later",
        "classes": "mp-blue mt-3",
        "action": "logout"
      },
      "TYPE": "CTA"
    },
    "ACCOUNT_LINKED": {
      "BODY_CONTENT_CLASSES": "margin-top-title",
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para1": {
            "text": "Success! Your account has been successfully updated.",
            "classes": "subtitle mx-5"
          },
          "para2": {
            "text": "Going forward, please use your Seller Center login credentials to access your Brand Portal account.",
            "classes": "subtitle mx-5"
          }
        }
      },
      "IMAGE": "SuccessCheck",
      "TITLE": {
        "classes": "justify-content-center",
        "content": {
          "para": {
            "text": "Success!"
          }
        }
      },
      "HEIGHT": 80,
      "PRIMARY_ACTION": {
        "text": "Continue to my account",
        "action": "toNext"
      },
      "TYPE": "CTA"
    },
    "PASSWORD_RESET_SELLER": {
      "BODY_CLASSES": "",
      "BODY_CONTENT_CLASSES": "px-3 font-size-15",
      "HEADER": "Seller Center Profile Management",
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para1": {
            "text": "Walmart Brand Portal accounts using Seller Center credentials cannot be managed directly through the Walmart Brand Portal.",
            "classes": "mx-2"
          },
          "para2": {
            "text": "In order to update your profile information or reset your password, you will need to log out of Walmart Brand Portal and manage your account in Seller Center.",
            "classes": "mx-2"
          }
        }
      },
      "PRIMARY_ACTION": {
        "text": "Go to Seller Center",
        "classes": "text-right float-right px-3",
        "containerClasses": "p-3",
        "action": "navigation",
        "actionParam": "https://seller.walmart.com"
      },
      "ADDITIONAL_ACTION": {
        "text": "Cancel",
        "classes": "mt-0 d-block",
        "action": "closeModal"
      },
      "FOOTER_CLASSES": "margin-unset bg-blue mt-4",
      "TYPE": "NOTIFICATION"
    }
  }
};

export default MODALSMETA;
