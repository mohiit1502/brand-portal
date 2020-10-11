// import CONSTANTS from "../../constants/constants";

/* eslint-disable quote-props */
const FORMFIELDCONFIG = {
  "SECTIONSCONFIG": {
    "COMPANYREG": {
      "sectionConfig": {
        "sectionTitle": "Create Company Profile",
        "sectionSubTitle": "Please provide the information in the form below to create your company profile.",
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

      },
      "formConfig": {
        "id": "companyreg",
        "loader": false,
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
          "layout": "1.1.0",
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
          "layout": "2.1.0",
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
          "invalidError": "Zip Code is invalid, expected format is [xxxxx] or [xxxxx-xxxx].",
          "invalidErrorPath": "CONSTANTS.ERRORMESSAGES.ZIPERROR",
          "key": "zip",
          "label": "ZIP",
          "layout": "4.1.6",
          "maxLength": 10,
          "patternPath": "CONSTANTS.REGEX.ZIP",
          "patternErrorMessagePath": "CONSTANTS.ERRORMESSAGES.ZIPERROR",
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
          "cancelHandlerArg": "businessRegistrationDoc",
          "onCancel": "cancelSelection",
          "tooltipContentKey": "businessDocContent",
          "disabled": true,
          "error": "",
          "filename": "",
          "changeHandlerArg": "businessRegistrationDoc",
          "icon": "Question",
          "id": "",
          "inputId": "businessRegistrationDoc",
          "key": "businessRegistrationDoc",
          "label": "Business registration documents (optional)",
          "layout": "5.1.0",
          "onChange": "displayProgressAndUpload",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "additionalDoc": {
          "buttonText": "Upload",
          "cancelHandlerArg": "additionalDoc",
          "onCancel": "cancelSelection",
          "tooltipContentKey": "additionalDocContent",
          "disabled": true,
          "error": "",
          "filename": "",
          "changeHandlerArg": "additionalDoc",
          "icon": "Question",
          "id": "",
          "inputId": "additionalDoc",
          "key": "additionalDoc",
          "label": "Additional documents (optional)",
          "layout": "6.1.0",
          "onChange": "displayProgressAndUpload",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "companyOnboardingActions": {
          "containerClasses": "mt-3",
          "colClasses": "text-right",
          "layout": "7.1.0",
          "type": "_buttonsPanel",
          "buttons": {
            "clear": {
              "classes": "btn btn-sm cancel-btn text-primary",
              "disabled": false,
              "onClick": "resetCompanyRegistration",
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
        //   "layout": "8.1.0",
        //   "onChange": "undertakingToggle",
        //   "required": true,
        //   "selected": false,
        //   "type": "_checkBox",
        // },
        // "companyRequestApprovalActions": {
        //   "containerClasses": "mt-3",
        //   "colClasses": "text-right",
        //   "layout": "9.1.0",
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
        "sectionTitle": " Thank you for sharing your company information.",
        "sectionSubTitle": "Now please tell us about your brand. If you own multiple brands, please select one which will be verified upon submission.",
      },
      "formConfig": {
        "id": "brandreg",
        "loader": false,
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
          "checkBoxClasses": "user-undertaking",
          "containerClasses": "mt-5",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "undertaking",
          "inputId": "undertaking",
          "key": "undertaking",
          "label": "I have read and agree to the Walmart Brand Portal ",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "required": true,
          "selected": false,
          "tou": true,
          "touLink": "Terms of Use.",
          "type": "_checkBox"
        },
        "brandOnboardingActions": {
          "containerClasses": "mt-3",
          "colClasses": "text-right",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "type": "_buttonsPanel",
          "buttons": {
          "back": {
            "classes": "btn btn-sm cancel-btn text-primary",
              "disabled": false,
              "onClick": "gotoCompanyRegistration",
              "text": "Back",
              "type": "button"
            },
            "submit": {
              "classes": "btn btn-sm btn-primary submit-btn px-3 ml-3",
                "disabled": true,
                "text": "Submit",
                "type": "submit"
            }
          }
        }
      }
    },
    "DASHBOARD": {
      "sectionConfig": {

      },
      "formConfig": {
        "id": "dashboard"
      },
      "fields": {

      }
    },
    "NEWUSER": {
      "sectionConfig": {
        "sectionTitleNew": "Invite a New User",
        "sectionTitleEdit": "Edit User"
      },
      "formConfig": {
        "formHeading": "Select the type of user you are inviting",
        "id": "newuser",
        "isDisabled": false,
        "isUpdateTemplate": false,
        "loader": false,
        "submitDisabled": true,
        "templateUpdateComplete": false,
        "underwritingChecked": false,
      },
      "fields": {
        "userType": {
          "containerClasses": "userType",
          "disabled": false,
          "name": "userType",
          "inputId": "userType",
          "key": "userType",
          "label": "",
          "layout": "1.1.0",
          "required": true,
          "value": "Internal",
          "type": "radio",
          "radioOptions": [
            {
              "id": 1,
              "value": "Internal",
              "label": "Internal"
            },
            {
              "id": 2,
              "value": "ThirdParty",
              "label": "3rd Party"
            }
          ]
        },
        "fieldsHeader": {
          "excludeColContainer": true,
          "excludeRowContainer": true,
          "header": "Please complete the following fields to invite a new user.",
          "layout": "2.1.0",
          "type": "_formFieldsHeader",
        },
        "firstName": {
          "containerClasses": "fname-lname",
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "firstName",
          "key": "firstName",
          "label": "First Name",
          "layout": "3.1.6",
          "pattern": null,
          "required": true,
          "type": "text",
          "value": ""
        },
        "lastName": {
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "lastName",
          "key": "lastName",
          "label": "Last Name",
          "layout": "3.2.6",
          "pattern": null,
          "required": true,
          "type": "text",
          "value": ""
        },
        "companyName": {
          "colClasses": "pl-1",
          "containerClasses": "company",
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "companyName",
          "key": "companyName",
          "label": "Company Name",
          "layout": "4.1.6",
          "pattern": null,
          "renderCondition": "{\"keyPath\": \"state.form.inputData.userType.value\", \"keyLocator\": \"parentRef\", \"valuePath\": \"USER.USER_TYPE.THIRD_PARTY\", \"valueLocator\": \"CONSTANTS\"}",
          "required": true,
          "type": "text",
          "value": ""
        },
        "emailId": {
          "containerClasses": "contact-details",
          "disabled": false,
          "disableDefaultBlueValidation": true,
          "error": "",
          "fieldOk": false,
          "inputId": "emailId",
          "invalidError": "Please enter a valid Email ID",
          "invalidErrorPath": "CONSTANTS.ERRORMESSAGES.EMAILERROR",
          "isUnique": true,
          "key": "emailId",
          "label": "Email",
          "layout": "5.1.6",
          "loader": false,
          "patternPath": "CONSTANTS.REGEX.EMAIL",
          "required": true,
          "type": "email",
          "value": ""
        },
        "phone": {
          "disabled": false,
          "disableDefaultBlueValidation": true,
          "error": "",
          "fieldOk": false,
          "inputId": "phone",
          "invalidError": "Please enter a valid phone number",
          "invalidErrorPath": "CONSTANTS.ERRORMESSAGES.PHONEERROR",
          "isUnique": true,
          "key": "phone",
          "label": "Mobile Number",
          "layout": "5.2.6",
          "maxLength": 17,
          "patternPath": "CONSTANTS.REGEX.PHONE",
          "prebounceChangeHandler": "prebounceChangeHandler",
          "required": false,
          "type": "text",
          "value": ""
        },
        "role": {
          "containerClasses": "role-and-brand",
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "role",
          "key": "role",
          "label": "Set Role",
          "layout": "6.1.6",
          "onChange": "setSelectInputValue",
          "dropdownOptions": [],
          "required": true,
          "type": "select",
          "value": ""
        },
        "brands": {
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "brands",
          "key": "brands",
          "label": "Assign Brand",
          "layout": "6.2.6",
          "onChange": "setMultiSelectInputValue",
          "dropdownOptions": [],
          "required": true,
          "type": "multiselect",
          "value": ""
        },
        "userActions": {
          "containerClasses": "action-footer",
          "colClasses": "text-right",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "layout": "7.1.0",
          "type": "_buttonsPanel",
          "buttons": {
            "cancel": {
              "classes": "btn btn-sm cancel-btn text-primary",
              "disabled": false,
              "onClick": "resetTemplateStatus",
              "text": "Cancel",
              "type": "button"
            },
            "submit": {
              "classes": "btn btn-sm btn-primary submit-btn px-3 ml-3",
              "disabled": true,
              "textObj": "{\"condition\": \"state.form.isUpdateTemplate\", \"true\": \"Save\", \"false\": \"Invite\"}",
              "type": "submit"
            }
          }
        }
      }
    },
    "NEWBRAND": {
      "sectionConfig": {
        "sectionTitleNew": "Register a Brand",
        "sectionTitleEdit": "Edit Brand Details",
      },
      "formConfig": {
        "formHeading": "Please complete the following fields to register your brand.",
        "id": "newbrand",
        "isSubmitDisabled": true,
        "isUpdateTemplate": false,
        "loader": false,
        "templateUpdateComplete": false,
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
        },
        "brandCreateActions": {
          "containerClasses": "mt-3",
          "colClasses": "text-right",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "type": "_buttonsPanel",
          "buttons": {
            "cancel": {
              "classes": "btn btn-sm cancel-btn text-primary",
              "disabled": false,
              "onClick": "resetTemplateStatus",
              "text": "Cancel",
              "type": "button"
            },
            "submit": {
              "classes": "btn btn-sm btn-primary submit-btn px-3 ml-3",
              "disabled": true,
              "text": "Submit",
              "type": "submit"
            }
          }
        },
      }
    },
    "NEWCLAIM": {
      "sectionConfig": {
        "id": "newclaim"
      },
      "formConfig": {
        "id": "newclaim"
      },
      "fields": {

      }
    },
    "RESETPASSWORD": {
      "sectionConfig": {
        "sectionTitle": "Change Password"
      },
      "formConfig": {
        "apiPath": "/api/users/resetPassword",
        "error": "",
        "formHeading": "Please provide your current password and new password to reset your password.",
        "id": "resetPassword",
        "incorrectPasswordError": "Current Password that you have entered is Incorrect!",
        "loader": false,
        "old5PasswordsError": "New password can not be 1 of your previous 5 passwords",
        "passwordsDifferent": false,
        "passwordChangedMessage": "Password Changed Successfully!",
        "passwordGuidance": "Password should contain a combination of upper case, lower case, numeric and special characters and should be between 8 and 16 characters long.",
        "passwordMismatchError": "New Password and Confirm Password fields do not match.",
        "passwordPolicyMessage": "Selected password doesn't adhere to Walmart Brand Portal's Security policy, please refer the note above.",
        "toastMessageExistingErrors": "Please resolve existing errors before proceeding!"
      },
      "fields": {
        "currentPassword": {
          "canShowPassword": true,
          "containerClasses": "px-0",
          "error": "",
          "id": "currentPassword",
          "inputId": "currentPassword",
          "key": "currentPassword",
          "label": "Current Password",
          "layout": "1.1.12",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "password",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Please enter current password."
            }
          }
        },
        "newPassword": {
          "canShowPassword": true,
          "containerClasses": "px-0",
          "error": "",
          "inputId": "newPassword",
          "key": "newPassword",
          "label": "New Password",
          "layout": "1.1.12",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "password",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Please enter new password."
            },
            "validatePasswordMatch": {
              "siblingField": "state.form.inputData.confirmNewPassword"
            }
          }
        },
        "confirmNewPassword": {
          "canShowPassword": true,
          "containerClasses": "px-0",
          "error": "",
          "inputId": "confirmNewPassword",
          "key": "confirmNewPassword",
          "label": "Confirm New Password",
          "layout": "1.1.12",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "isLastField": true,
          "subtitle": "",
          "type": "password",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Please confirm new password."
            },
            "validatePasswordMatch": {
              "siblingField": "state.form.inputData.newPassword"
            }
          }
        },
        "errorSub": {
          "containerClasses": "pl-2 mt-n23 mb-2rem",
          "error": "",
          "errorClasses": "form-text custom-input-help-text text-danger",
          "id": "errorSub",
          "layout": "1.1.12",
          "type": "_error",
        },
        "resetPasswordAction": {
          "containerClasses": "px-0 text-right",
          "colClasses": "text-right",
          "layout": "1.1.12",
          "type": "_buttonsPanel",
          "buttons": {
            "cancel": {
              "classes": "btn btn-sm cancel-btn text-primary",
              "onClick": "resetTemplateStatus",
              "text": "Cancel",
              "type": "button"
            },
            "changePassword": {
              "classes": "btn btn-sm btn-primary submit-btn px-3 ml-3",
              "text": "Change Password",
              "type": "submit"
            }
          }
        },
      }
    },
    "USERPROFILE": {
      "sectionConfig": {
        "headerClasses": "content-header-row h3 p-4",
        "formClasses": "row content-row p-4 mt-4",
        "sectionTitle": "User Profile"
      },
      "formConfig": {
        "apiPath": "/api/users",
        "excludeRowContainer": true,
        "id": "userProfile",
        "loader": false,
        "isDisabled": true,
        "profileSaveMessage": "Changes to Profile Successfully Saved!"
      },
      "fields": {
        "firstName": {
          "disabled": true,
          "error": "",
          "id": "firstName",
          "inputId": "firstName",
          "invalidError": "Please enter a valid First Name",
          "key": "firstName",
          "label": "First Name",
          "layout": "1.1.6",
          "patternPath": "CONSTANTS.REGEX.NAMES",
          "patternErrorMessage": "Please enter a valid first name.",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "type": "text",
          "value": "",
          "initValuePath": "firstName"
        },
        "lastName": {
          "disabled": true,
          "error": "",
          "id": "lastName",
          "inputId": "lastName",
          "invalidError": "Please enter a valid Last Name",
          "key": "lastName",
          "label": "Last Name",
          "layout": "1.1.6",
          "patternPath": "CONSTANTS.REGEX.NAMES",
          "patternErrorMessage": "Please enter a valid last name.",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "type": "text",
          "value": "",
          "initValuePath": "lastName"
        },
        "companyName": {
          "disabled": true,
          "error": "",
          "id": "companyName",
          "inputId": "companyName",
          "invalidError": "Please enter valid Company Name",
          "key": "companyName",
          "label": "Company Name",
          "layout": "1.1.6",
          "patternPath": "CONSTANTS.REGEX.COMPANY",
          "patternErrorMessage": "Please provide a valid company name.",
          "preventHTMLRequiredValidation": true,
          "renderCondition": "{\"keyPath\": \"props.userProfile.type\", \"keyLocator\": \"parentRef\", \"valuePath\": \"USER.USER_TYPE.THIRD_PARTY\", \"valueLocator\": \"CONSTANTS\"}",
          "required": true,
          "type": "text",
          "value": "",
          "initValuePath": "organization.name"
        },
        "emailId": {
          "disabled": true,
          "error": "",
          "id": "emailId",
          "inputId": "emailId",
          "key": "emailId",
          "label": "Email",
          "layout": "1.1.6",
          "pattern": null,
          "required": true,
          "type": "email",
          "value": "",
          "initValuePath": "email"
        },
        "phone": {
          "disabled": true,
          "error": "",
          "id": "phone",
          "inputId": "phone",
          "invalidError": "Please select a valid Phone Number",
          "key": "phone",
          "label": "Mobile Number",
          "layout": "1.1.6",
          "maxLength": 17,
          "patternPath": "CONSTANTS.REGEX.PHONE",
          "prebounceChangeHandler": "prebounceChangeHandler",
          "preventHTMLRequiredValidation": true,
          "required": false,
          "type": "text",
          "value": "",
          "initValuePath": "phoneNumber"
        },
        "resetPasswordAction": {
          "containerClasses": "mb-5 pb-5 password-reset-col",
          "colClasses": "",
          "layout": "1.1.12",
          "type": "_buttonsPanel",
          "buttons": {
            "changePassword": {
              "classes": "btn btn-primary btn-sm px-3",
              "onClick": "displayChangePassword",
              "text": "Change Password",
              "type": "button"
            }
          }
        },
        "editActions": {
          "containerClasses": "h-40 pt-5 mt-5 text-right",
          "colClasses": "text-right",
          "layout": "1.1.12",
          "type": "_buttonsPanel",
          "buttons": {
            "edit": {
              "classes": "btn btn-primary btn-sm px-4",
              "handlerArg": false,
              "onClick": "disableInput",
              "renderCondition": "{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": true}",
              "text": "Edit",
              "type": "button"
            },
            "cancel": {
              "classes": "btn btn-link font-size-14 px-4 mr-3",
              "handlerArg": true,
              "renderCondition": "{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": false}",
              "onClick": "disableInput",
              "text": "Cancel",
              "type": "button"
            },
            "save": {
              "classes": "btn btn-primary btn-sm px-4 font-size-14",
              "renderCondition": "{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": false}",
              "text": "Save",
              "type": "submit"
            }
          }
        }
      }
    }
  }
};

export default FORMFIELDCONFIG;
