/* eslint-disable quote-props */

const MODALSMETA = {
  "MODALSCONFIG": {
    "PORTAL_REGISTRATION": {
      "CODE": 1
    },
    "SELLER_WELCOME_PROMPT": {
      "BODY_CONTENT_CLASSES": "text-left",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset",
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para3": {
            "text": "Welcome __firstNamePlaceholder__ __lastNamePlaceholder__",
            "dynamicReplacementConfig": {"__firstNamePlaceholder__": "profile.firstName", "__lastNamePlaceholder__": "profile.lastName"},
            "classes": "font-weight-bold mt-2 mb-4 mx-4 font-size-28 text-center"
          },
          "para1": {
            "text": "To simplify the process, we will be using the information in your Seller\nCenter account to set up your Brand Portal account.\nPlease complete the following steps.",
            "classes": "mx-4 font-size-16"
          },
          "list": {
            "type": "ul",
            "subType": "1",
            "liClasses": "font-size-16 mt-4",
            "steps": [
              "Confirm the information of your company and provide the information of your registered trademark.",
              "The information provided will be verified by our team. You will receive a confirmation email once your application has been approved."
            ]
          }
        }
      },
      "IMAGE": "ProblemSolving",
      "PRIMARY_ACTION": {
        "text": "Start",
        "action": "hideModal"
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
            "text": "You can review the status of your application by logging into\n your Brand Portal account.",
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
        "action": "hideModal"
      },
      "TYPE": "CTA"
    },
    "APPLICATION_INFORMATION": {
      "CODE": 2,
      "BODY_CONTENT_CLASSES": "ml-5 text-left",
      "BODY_CLASSES": "px-5 modal-background",
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
              "text": "On Hold - Action Required",
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
                "text": "Your company information and brand details are currently ",
                "classes": "",
                "key": ["NEW"]
              },
              {
                "text": "Your declined and brand details are currently ",
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
                "text": "Your company information and brand details are currently ",
                "classes": "",
                "key": ["NEW"]
              },
              {
                "text": "Your declined and brand details are currently ",
                "classes": "",
                "key": ["REJECTED", "REJECTED_ON_AUDIT"]
              }

          ],
          "chunk3": [
            {
              "text": "__emailPlaceholder__",
              "classes": "font-weight-bold mt-5",
              "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
              "key": ["ON_HOLD"]
            },
            {
              "text": "__emailPlaceholder__",
              "classes": "font-weight-bold mt-5",
              "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
              "key": ["NEW"]
            }
            
          ],
          "chunk4": [
            {
              "text": "__emailPlaceholder__",
              "classes": "font-weight-bold mt-5",
              "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
              "key": ["ON_HOLD"]
            }
          ]
          },
          "para3": {
            "renderCondition": {
              "key": ["ON_HOLD"],
              "path": "orgStatus"
            },
            "text": "Review and confirm that the information in your application is accurate.",
            "classes": "mt-2"
          },
          "para4": {
            "text": "",
            "classes": "border-bottom mt-4"
          }
        }
      },
      "TITLE": {
        "ROW_CLASSES": "ml-5",
        "content": {
          "para": {
            "text": "__businessName__",
            "dynamicReplacementConfig": {"__businessName__": "profile"},
            "classes": "text-left h3 font-weight-bold col-9"
          },
          "button1": {
            "icon": "EditOutlinedIcon",
            "classes": "col btn btn-primary",
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
      "BODY_CONTENT_CLASSES": "text-left",
      "BODY_CLASSES": "px-5",
      "MODAL_DIALOG_CLASSES": "width-unset",
      "MESSAGE": {
        "classes": "mt-4",
        "content": {
          "para3": {
            "text": "Your email address has \nbeen verified",
            "classes": "font-weight-bold mt-2 mb-4 mx-4 font-size-28 text-center"
          },
          "para1": {
            "text": "Next, we need to verify that you are the owner of the intellectual\n property rights that you wish to enforce.",
            "classes": "mx-4 font-size-16"
          },
          "list": {
            "type": "ul",
            "subType": "1",
            "liClasses": "font-size-16 mt-4",
            "steps": [
              "The information provided will be verified by our team.",
              "You will receive a confirmation email once your application has\nbeen submitted. We will keep you updated on the status of\nyour application via email."
            ]
          }
        }
      },
      "IMAGE": "ProblemSolving",
      "PRIMARY_ACTION": {
        "text": "Start",
        "action": "hideModal"
      },
      "TYPE": "CTA"
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
            "classes": "h3 mx-5 px-5 mb-2 font-weight-bold"
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
        "text": "Go Back",
      },
      "TYPE": "CTA"
    },
    "PORTAL_VERIFICATION": {
      "CODE": 2,
      "IMAGE": "Arrow",
      "MESSAGE": "Once complete, we will send a confirmation to your registered email.\n Please login using the shared link.",
      "TITLE": "Your company and brand details are being verified"
    },
    "PORTAL_DASHBOARD": {
      "CODE": 4
    },
    "PORTAL_ACCESS_REVOKED": {
      "MESSAGE": {
        "classes": "mt-4 mx-4 access-revoke",
        "content": {
          "partial1": {
            "chunk1": "Please contact us at ",
            "anchor1": {
              "text": "brandportal@walmart.com",
              "href": "mailto:brandportal@walmart.com"
            },
            "chunk2": " if you would still like to create an account"
          }
        }
      },
      "CODE": 8,
      "IMAGE": "Alert",
      "SUBTITLE": "We have not been able to verify the information provided for your application.",
      "TITLE": "Application On Hold"
    },
    "USER_ACCESS_REVOKED": {
      "CODE": 16,
      "IMAGE": "RedCircleCross",
      "MESSAGE": "Your account access has been revoked for security reasons",
      "TITLE": "Access Denied"
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
      "IMAGE": "EmailIcon",
      "SUBTITLE": {
        "content": {
          "para1": {
            "text": "To move forward with your application, we need to verify the\nemail address associated with your account.",
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
              "dynamicReplacementConfig": {"__emailPlaceholder__": "profile.email"},
            },
            "chunk3": ". Follow the link in the email to complete verification."
          }
        }
      },
      "TITLE": {
        "content": {
          "para": {
            "text": "Please verify your email address\nto continue with the registration process",
            "classes": "h5 mx-5 px-3 mb-4 font-weight-bold"
          }
        }
      },
      "ADDITIONAL_ACTION": {
        "action": "resendInvite",
        "text": "Resend Verification Email",
        "actionHelpText": {
          "text": "No message received?",
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
      "TITLE": "Link your accounts to continue",
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
      "TITLE": "Success!",
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
