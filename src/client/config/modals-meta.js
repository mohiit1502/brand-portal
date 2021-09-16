const MODALSMETA = {
  "MODALSCONFIG": {
    "PORTAL_REGISTRATION": {
      "CODE": 1
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
      "IMAGE": "EmailIcon",
      "MESSAGE": "A verification email has been sent to your email address.\nPlease verify using the link provided.",
      "TITLE": "Email verification required",
      "ADDITIONAL_ACTION": "Resend Verification Email"
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
            "text": "The Walmart [Seller Center] credentials used to log in are associated with the company details found in your existing brand portal account for:",
            "classes": "subtitle mx-4"
          },
          "para2": {
            "text": "[__namePlaceholder__]",
            "dynamicReplacementConfig": {"__namePlaceholder__": "profile.organization.name"},
            "classes": "font-weight-bold subtitle mt-2 mb-4 mx-4"
          },
          "para3": {
            "text": "In order to access your claims dashboard with your Walmart [Seller Center] log in, you must link these accounts and override your current brand portal log in.",
            "classes": "subtitle mx-3"
          },
          "para4": {
            "text": "This action needs to occur only once, and cannot be undone.",
            "classes": "subtitle mb-4 mx-4"
          }
        }
      },
      "CODE": 256,
      "IMAGE": "ShieldTick",
      "TITLE": "Link your accounts to continue",
      "PRIMARY_ACTION": {
        "text": "Link accounts",
        "action": "linkConfirmation"
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
            "text": "Your account has been successfully updated.",
            "classes": "subtitle mx-5"
          },
          "para2": {
            "text": "From now on, you will use your Seller Center user name and password to access the Brand Portal.",
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
        "classes": "mt-0",
        "action": "closeModal"
      },
      "FOOTER_CLASSES": "margin-unset bg-blue",
      "TYPE": "NOTIFICATION"
    }
  }
}

export default MODALSMETA;
