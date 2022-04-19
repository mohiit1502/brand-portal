const SECTIONSMETA = {
  "SECTIONSCONFIG": {
    "PROFILE": {
      "header1": {
        "title": "User Profile",
        "classes": "mb-4 h2 font-weight-bold"
      },
      "section1": {
        "layoutClasses": "col-6 mb-3 pl-0",
        "innerClasses": "bordered-box shadow",
        "header": {
          "text": "My Info",
          "classes": "mb-3 font-size-28 col-12"
        },
        "body": {
          "classes": "px-4 pt-4 pb-3 row overflow-auto",
          "content": {
            "key-val1": {
              "containerClasses": "col-6 mb-3",
              "dynamicReplacementConfig": {"__firstNamePlaceholder__": "profile.firstName", "__lastNamePlaceholder__": "profile.lastName"},
              "key": "Name",
              "value": "__firstNamePlaceholder__ __lastNamePlaceholder__"
            },
            "key-val2": {
              "containerClasses": "col-6 mb-3",
              "dynamicReplacementConfig": {"__email__": "profile.email"},
              "key": "Email",
              "value": "__email__"
            },
            "key-val3": {
              "containerClasses": "col-6 mb-3",
              "dynamicReplacementConfig": {"__phoneCountry__": "profile.phoneCountry", "__phoneNumber__": "profile.phoneNumber"},
              "key": "Phone",
              "value": "__phoneCountry__ __phoneNumber__"
            },
            "key-val4": {
              "containerClasses": "col-6 mb-3",
              "dynamicReplacementConfig": {"__orgName__": "profile.organization.name"},
              "key": "Company",
              "value": "__orgName__"
            },
            "subtitle1": {
              "containerClasses": "col-6",
              "dynamicReplacementConfig": {"__orgName__": "profile.organization.name"},
              "key": "joinedDate",
              "value": "Joined __date__"
            }
          }
        },
        "footer": {
          "text": "Edit",
          "classes": "w-100 d-block py-875 text-center footer-text"
        }
      },
      "header2": {
        "title": "Contact Information",
        "classes": "mb-4 h2 mt-5 font-weight-bold"
      },
      "banner1": {
        "criteria": {"field": "userProfile.role", "value": "SuperAdmin"},
        "layoutClasses": "col-6 pl-0",
        "innerClasses": "",
        "renderCondition": "{\"keyPath\": \"userProfile.role.name\", \"keyLocator\": \"props\", \"value\": \"super admin\"}",
        "text": "This contact information will be shared with sellers reported by the user(s) of this Brand Portal account. If no public contact information is provided, the contact information of the user will be shared by default.",
        "theme": "blue",
        "variant": "v2"
      },
      "section2": {
        "layoutClasses": "col-12",
        "body": {
          "classes": "row",
          "content": {
            "section1": {
              "layoutClasses": "col-6 mb-3 pl-0",
              "innerClasses": "bordered-box shadow",
              "renderCondition": "{\"keyPath\": \"userProfile.role.name\", \"keyLocator\": \"props\", \"value\": [\"admin\",\"reporter\"]}",
              "header": {
                "text": "Super Admin",
                "classes": "mb-3 font-size-28 col-12"
              },
              "body": {
                "classes": "p-4 row overflow-auto",
                "content": {
                  "key-val1": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__firstNamePlaceholder__": "profile.firstName"},
                    "key": "First Name",
                    "value": "__firstNamePlaceholder__"
                  },
                  "key-val2": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__lastNamePlaceholder__": "profile.lastName"},
                    "key": " Last Name",
                    "value": "__lastNamePlaceholder__"
                  },
                  "key-val3": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__email__": "profile.email"},
                    "key": "Email",
                    "value": "__email__"
                  },
                  "key-val4": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__phoneCountry__": "profile.phoneCountry", "__phoneNumber__": "profile.phoneNumber"},
                    "key": "Phone",
                    "value": "__phoneCountry__ __phoneNumber__"
                  }
                }
              }
            },
            "section2": {
              "layoutClasses": "col-6 mb-3 pl-0",
              "innerClasses": "bordered-box shadow",
              "header": {
                "text": "Public Contact",
                "classes": "mb-3 font-size-28 col-12"
              },
              "body": {
                "classes": "p-4 row overflow-auto",
                "content": {
                  "key-val1": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__firstNamePlaceholder__": "profile.firstName"},
                    "key": "First Name",
                    "value": "__firstNamePlaceholder__"
                  },
                  "key-val2": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__lastNamePlaceholder__": "profile.lastName"},
                    "key": " Last Name",
                    "value": "__lastNamePlaceholder__"
                  },
                  "key-val3": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__email__": "profile.email"},
                    "key": "Email",
                    "value": "__email__"
                  },
                  "key-val4": {
                    "containerClasses": "col-6 mb-3",
                    "dynamicReplacementConfig": {"__phoneCountry__": "profile.phoneCountry", "__phoneNumber__": "profile.phoneNumber"},
                    "key": "Phone",
                    "value": "__phoneCountry__ __phoneNumber__"
                  }
                }
              }
            }
          }
        }
      },

    }
  }
}

export default SECTIONSMETA;
