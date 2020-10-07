import CONSTANTS from "../../constants/constants";

/* eslint-disable quote-props */
const FORMFIELDCONFIG = {
  "SECTIONSCONFIG": {
    "COMPANYREG": {
      "sectionConfig": {
        "loader": false,
        "id": "companyreg",
        // "conditionalRenders": {
        //   "render1": {
        //     "id": "doesNotRequireAccess",
        //     "complyingFields": ["address", "city", "state", "zip", "country", "businessRegistrationDoc", "additionalDoc"],
        //     "condition": {"flag": "requestAdministratorAccess", "locator": "form", "value": false}
        //   },
        //   "render2": {
        //     "id": "requireAccess",
        //     "complyingFields": ["companyRequestApprovalActions", "undertakingToggle"],
        //     "condition": {"flag": "requestAdministratorAccess", "locator": "form", "value": true}
        //   }
        // },
        "sectionTitle": "Create Company Profile",
        "sectionSubTitle": "Please provide the information in the form below to create your company profile.",
        "isSubmitDisabled": true,
        "isClearDisabled": false,
        "requestAdministratorAccess": false
      },
      "fields": {
        "companyName": {
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "companyName",
          "isUnique": true,
          "key": "companyName",
          "label": "Company Name",
          "layout": "1.1.12",
          "loader": false,
          "pattern": null,
          "required": true,
          "subtitle": "Please ensure that the company name you enter matches the official records.",
          "type": "text",
          "value": ""
        },
        "address": {
          "disabled": true,
          "error": "",
          "inputId": "address",
          "key": "address",
          "label": "Address",
          "layout": "2.1.12",
          "pattern": null,
          "renderDependency": "requestAdministratorAccess",
          "required": true,
          "subtitle": "",
          "type": "text",
          // subtitle: "Autocomplete Powered by Google",
          "value": ""
        },
        "city": {
          "disabled": true,
          "error": "",
          "inputId": "city",
          "key": "city",
          "label": "City",
          "layout": "3.1.6",
          "pattern": null,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": ""
        },
        "state": {
          "colClasses": "col-6",
          "disabled": true,
          "error": "",
          "inputId": "state",
          "key": "state",
          "label": "State",
          "layout": "3.2.6",
          "pattern": null,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": ""
        },
        "zip": {
          "colClasses": "col-6",
          "disabled": true,
          "error": "",
          "inputId": "zip",
          "invalidError": CONSTANTS.REGEX.ZIPERROR,
          "key": "zip",
          "label": "ZIP",
          "layout": "4.1.6",
          "maxLength": 10,
          "onInvalidHandler": "onInvalidHandler",
          "pattern": CONSTANTS.REGEX.ZIP,
          "patternErrorMessage": CONSTANTS.REGEX.ZIPERROR,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": ""
          // pattern: "",
        },
        "country": {
          "colClasses": "col-6",
          "disabled": true,
          "error": "",
          "inputId": "country",
          "key": "country",
          "label": "Country",
          "layout": "4.2.6",
          "pattern": null,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "USA"
        },
        "businessRegistrationDoc": {
          "buttonText": "Upload",
          "cancelSelection": "cancelPrimaryDocumentSelection",
          "content": "businessDocContent",
          "disabled": true,
          "error": "",
          "filename": "",
          "icon": "Question",
          "id": "",
          "inputId": "businessRegistrationDoc",
          "key": "businessRegistrationDoc",
          "label": "Business registration documents (optional)",
          "layout": "5.1.12",
          "onChange": "uploadPrimaryDocument",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "additionalDoc": {
          "buttonText": "Upload",
          "cancelSelection": "cancelAdditionalDocumentSelection",
          "content": "additionalDocContent",
          "disabled": true,
          "error": "",
          "filename": "",
          "icon": "Question",
          "id": "",
          "inputId": "additionalDoc",
          "key": "additionalDoc",
          "label": "Additional documents (optional)",
          "layout": "6.1.12",
          "onChange": "uploadAdditionalDocument",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "companyOnboardingActions": {
          "containerClasses": "mt-3",
          "colClasses": "text-right",
          "layout": "7.1.12",
          "type": "_buttonsPanel",
          "buttons": {
            "clear": {
              "classes": "btn btn-sm cancel-btn text-primary",
              "disabled": false,
              "onChange": "resetCompanyRegistration",
              "text": "Clear",
              "type": "button"
            },
            "submit": {
              "classes": "btn btn-sm btn-primary submit-btn px-3 ml-3",
              "disabled": true,
              "text": "Next",
              "type": "submit"
            }
          }
        },
        // "undertakingToggle": {
        //   "checkBoxClasses": "user-undertaking",
        //   "containerClasses": "mt-5",
        //   "error": "",
        //   "id": "user-undertaking",
        //   "label": "I have read and agree to the Walmart Brand Portal Terms of Use.",
        //   "labelClasses": "user-undertaking-label",
        //   "layout": "8.1.12",
        //   "onChange": "undertakingToggle",
        //   "required": true,
        //   "selected": false,
        //   "type": "_checkBox",
        // },
        // "companyRequestApprovalActions": {
        //   "containerClasses": "mt-3",
        //   "colClasses": "text-right",
        //   "layout": "9.1.12",
        //   "buttons": {
        //     "cancel": {
        //       "classes": "btn btn-sm cancel-btn text-primary",
        //       "disabled": false,
        //       "onChange": "cancelRequestCompanyAccess",
        //       "text": "Cancel",
        //       "type": "button"
        //     },
        //     "submit": {
        //       "classes": "btn btn-sm btn-primary submit-btn px-3 ml-3",
        //       "disabled": true,
        //       "text": "Request Access",
        //       "type": "submit"
        //     }
        //   }
        // }
      }
    },
    "BRANDREG": {
      "sectionConfig": {
        "loader": false,
        "id": "brandreg"
      },
      "fields": {
        "trademarkNumber": {
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "trademarkNumber",
          "isValid": false,
          "key": "trademarkNumber",
          "label": "Trademark Number",
          "loader": false,
          "maxLength": 7,
          "pattern": null,
          "subtitle": "Please input the trademark registration number. Only USPTO registered trademarks are accepted.",
          "required": true,
          "type": "text",
          "value": "",
          "validators": {
            "validateLength": {
              "minLength": 7,
              "maxLength": 7,
              "error": "Trademark number should be 7 numeric characters long."
            }
          }
        },
        "brandName": {
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "brandName",
          "isUnique": false,
          "key": "brandName",
          "label": "Brand Name",
          "loader": false,
          "pattern": null,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
        },
        "comments": {
          "disabled": false,
          "error": "",
          "inputId": "comments",
          "key": "comments",
          "label": "Comments",
          "pattern": null,
          "required": false,
          "subtitle": "",
          "type": "textarea",
          "value": ""
        },
        "undertaking": {
          "selected": false,
          "label": "I have read and agree to the Walmart Brand Portal "
        }
      }
    },
    "DASHBOARD": {
      "sectionConfig": {
        "id": "dashboard"
      },
      "fields": {

      }
    },
    "NEWUSER": {
      "sectionConfig": {
        "loader": false,
        "id": "newuser"
      },
      "fields": {

      }
    },
    "NEWBRAND": {
      "sectionConfig": {
        "id": "newbrand",
        "loader": false,
        "subTitle": "Please complete the following fields to register your brand."
      },
      "fields": {
        "trademarkNumber": {
          "disabled": false,
          "error": "",
          "inputId": "trademarkNumber",
          "isValid": false,
          "key": "trademarkNumber",
          "label": "Trademark Number",
          "loader": false,
          "maxLength": 7,
          "pattern": null,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateLength": {
              "minLength": 7,
              "maxLength": 7,
              "error": "Trademark number should be 7 numeric characters long."
            }
          }
        },
        "brandName": {
          "disabled": false,
          "error": "",
          "inputId": "brandName",
          "isUnique": false,
          "key": "brandName",
          "label": "Brand Name",
          "pattern": null,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": ""
        },
        "comments": {
          "disabled": false,
          "error": "",
          "inputId": "comments",
          "key": "comments",
          "label": "Comments",
          "pattern": null,
          "required": false,
          "subtitle": "",
          "type": "textarea",
          "value": ""
        }
      }
    },
    "NEWCLAIM": {
      "sectionConfig": {
        "id": "newclaim"
      },
      "fields": {

      }
    }
  }
};

export default FORMFIELDCONFIG;
