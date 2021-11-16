/* eslint-disable quote-props */
const FORMFIELDCONFIG = {
  "SECTIONSCONFIG": {
    "COMPANYREG": {
      "sectionConfig": {
        "sectionTitle": "Create Company Profile",
        "sectionSellerTitle": "Confirm Company Profile",
        "sectionSubTitle": "Please provide the information in the form below to create your company profile.",
        "sectionSellerSubTitle": "Review your Seller Center information to create your company profile."
      },
      "formConfig": {
        "actionsToDisable": ["clear"],
        "id": "companyreg",
        "loader": false,
        "isSubmitDisabled": true,
        "isClearDisabled": false,
        "formActions": "companyOnboardingActions",
        "requestAdministratorAccess": false,
        "internationalSellerExceptions": [
          "ss1@mailinator.com"
        ]
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
          "changeHandlerArg": "businessRegistrationDoc",
          "disabled": true,
          "endpoint": "/api/company/uploadBusinessDocument",
          "error": "",
          "filename": "",
          "icon": "Question",
          "id": "",
          "inputId": "businessRegistrationDoc",
          "key": "businessRegistrationDoc",
          "label": "Business registration documents (optional)",
          "layout": "5.1.0",
          "onCancel": "cancelSelection",
          "onChange": "displayProgressAndUpload",
          "tooltipContentKey": "businessDocContent",
          "otherType": "additionalDoc",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "additionalDoc": {
          "buttonText": "Upload",
          "cancelHandlerArg": "additionalDoc",
          "changeHandlerArg": "additionalDoc",
          "disabled": true,
          "endpoint": "/api/company/uploadAdditionalDocument",
          "error": "",
          "filename": "",
          "icon": "Question",
          "id": "",
          "inputId": "additionalDoc",
          "key": "additionalDoc",
          "label": "Additional documents (optional)",
          "layout": "6.1.0",
          "onCancel": "cancelSelection",
          "onChange": "displayProgressAndUpload",
          "otherType": "businessRegistrationDoc",
          "tooltipContentKey": "additionalDocContent",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "companyOnboardingActions": {
          "containerClasses": "mt-3",
          "colClasses": "company-onboarding-button-panel text-right",
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
        }
      }
    },
    "BRANDREG": {
      "sectionConfig": {
        "sectionTitle": " Thank you for sharing your company information.",
        "sectionSubTitle": "Now please tell us about your brand. If you own multiple brands, please select one which will be verified upon submission."
      },
      "formConfig": {
        "id": "brandreg",
        "loader": false
      },
      "fields": {
        "trademarkNumber": {
          "disabled": false,
          "error": "",
          "ERROR5XX": "Unable to reach our services!",
          "EXISTS": "__trademarkNumber__ is already registered with a Walmart Brand Portal account. For more information please contact brandportal@walmart.com",
          "fieldOk": false,
          "inputId": "trademarkNumber",
          "INVALID": "__trademarkNumber__ is not a USPTO registered trademark number.",
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
          "colClasses": "brand-onboarding-button-panel text-right",
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
      "sectionConfig": {},
      "formConfig": {
        "id": "dashboard"
      },
      "fields": {}
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
        "underwritingChecked": false
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
          "onChange": "setSelectInputValue",
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
          "type": "_formFieldsHeader"
        },
        "firstName": {
          "containerClasses": "fname-lname",
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "firstName",
          "key": "firstName",
          "label": "First Name",
          "layout": "4.1.6",
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
          "layout": "4.2.6",
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
          "disableDefaultBlurValidation": true,
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
          "pattern": "(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))",
          "patternPath": "CONSTANTS.REGEX.EMAIL",
          "required": true,
          "type": "email",
          "value": ""
        },
        "phone": {
          "disabled": false,
          "disableDefaultBlurValidation": true,
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
          "colClasses": "new-user-button-panel text-right",
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
        "sectionTitleEdit": "Edit Brand Details"
      },
      "formConfig": {
        "formHeading": "Please complete the following fields to register your brand.",
        "id": "newbrand",
        "isSubmitDisabled": true,
        "isUpdateTemplate": false,
        "loader": false,
        "templateUpdateComplete": false
      },
      "fields": {
        "trademarkNumber": {
          "disabled": false,
          "error": "",
          "ERROR5XX": "Unable to reach our services!",
          "EXISTS": "__trademarkNumber__ is already registered with a Walmart Brand Portal account. For more information please contact brandportal@walmart.com",
          "fieldOk": false,
          "inputId": "trademarkNumber",
          "INVALID": "__trademarkNumber__ is not a USPTO registered trademark number.",
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
          "placeholder": "Please provide additional information about your brand.",
          "value": ""
        },
        "brandCreateActions": {
          "containerClasses": "mt-3",
          "colClasses": "new-brand-button-panel text-right",
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
        }
      }
    },
    "NEWCLAIM": {
      "sectionConfig": {
        "id": "newclaim",
        "sectionTitleNew": "New Claim",
        "sectionTitleEdit": ""
      },
      "formConfig": {
        "id": "newclaim",
        "loader": false,
        "isSubmitDisabled": true,
        "brandNameSelected": false
      },
      "fields": {
        "fieldsHeader_1": {
          "excludeColContainer": true,
          "excludeRowContainer": true,
          "header": "Select your brand",
          "layout": "1.1.0",
          "type": "_formFieldsHeader"
        },
        "brandName": {
          "disabled": false,
          "dropdownOptions": [],
          "error": "",
          "inputId": "brandName",
          "key": "brandName",
          "label": "Brand Name",
          "onChange": "setSelectInputValue",
          "pattern": null,
          "realign": true,
          "required": true,
          "subtitle": "If you do not see a brand in this list, please have the administrator of the account register a new brand.",
          "type": "select",
          "unpadSubtitle": true,
          "value": ""
        },
        "fieldsHeader_2": {
          "excludeColContainer": true,
          "excludeRowContainer": true,
          "header": "Select the type of infringement you are reporting",
          "layout": "3.1.0",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "_formFieldsHeader"
        },
        "claimType": {
          "customChangeHandler": "customChangeHandler",
          "disabled": false,
          "dropdownOptions": [],
          "error": "",
          "inputId": "claimType",
          "label": "Claim Type",
          "key": "claimType",
          "layout": "4.1.4",
          "onChange": "setSelectInputValue",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "pattern": null,
          "subtitle": "",
          "type": "select",
          "value": ""
        },
        "claimTypeIdentifier": {
          "disabled": true,
          "label": "Claim Type Identifier",
          "key": "claimTypeIdentifier",
          "layout": "4.2.4",
          "inputId": "claimTypeIdentifier",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "value": "",
          "type": "text",
          "pattern": null,
          "isValid": false,
          "subtitle": "",
          "error": "",
          "onChange": "onChange"
        },
        "fieldsHeader_3": {
          "excludeColContainer": true,
          "excludeRowContainer": true,
          "header": "Please fill out the following details to submit your claim",
          "layout": "5.1.0",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "_formFieldsHeader"
        },
        "urlItems": {
          "disableAddItem": true,
          "error": "",
          "fieldLoader": false,
          "inputId": "items",
          "isSellerNameDisabled": true,
          "key": "items",
          "layout": "17.1.0",
          "type": "_urlItems",
          "onChangeSellerName": "setSelectInputValue",
          "onChangeItem": "getItemListFromChild",
          "onChangeUrl": "onChange",
          "prebounceChangeHandler": "disableSubmitButton",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "itemList": [
            {
              "id": "item-0",
              "url": {
                "label": "Item URL",
                "required": true,
                "value": "",
                "type": "url",
                "pattern": "https?://www.walmart.com/.+",
                "disabled": false,
                "isValid": false,
                "subtitle": "",
                "error": ""
              },
              "sellerName": {
                "dropdownOptions": [],
                "label": "Seller Name",
                "required": true,
                "value": "",
                "pattern": null,
                "disabled": true,
                "subtitle": "",
                "type": "multiselect",
                "error": "",
                "validators": {
                  "validateLength": {
                    "minLength": "3",
                    "error": "Minimum length is 3 characters"
                  }
                }
              }
            }
          ]
        },
        "comments": {
          "containerClasses": "mb-3",
          "disabled": false,
          "error": "",
          "inputId": "comments",
          "key": "comments",
          "layout": "7.1.0",
          "label": "Comments",
          "pattern": null,
          "prebounceChangeHandler": "trimSpaces",
          "required": true,
          "rowCount": 2,
          "subtitle": "",
          "type": "textarea",
          "value": "",
          "placeholder": "Please provide additional information about the claim",
          "onChange": "onChange",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "validators": {
            "validateRequired": {
              "error": "Please be sure to provide details regarding your claim."
            },
            "validateLength": {
              "minLength": 20,
              "maxLength": 2000,
              "error": "Comments should be between 20 and 2000 characters!"
            }
          }
        },
        "user_undertaking_1": {
          "category": "userUnderTaking",
          "containerClasses": "mb-2",
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_1",
          "inputId": "user_undertaking_1",
          "key": "user_undertaking_1",
          "layout": "8.1.0",
          "label": "I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "selected": false,
          "type": "_checkBox"
        },
        "user_undertaking_2": {
          "category": "userUnderTaking",
          "containerClasses": "mb-2",
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_2",
          "inputId": "user_undertaking_2",
          "key": "user_undertaking_2",
          "layout": "9.1.0",
          "label": "This notification is accurate; and UNDER PENALTY OF PERJURY, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "selected": false,
          "type": "_checkBox"
        },
        "user_undertaking_3": {
          "category": "userUnderTaking",
          "containerClasses": "mb-2",
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_3",
          "inputId": "user_undertaking_3",
          "key": "user_undertaking_3",
          "layout": "10.1.0",
          "label": "I acknowledge that under Section 512(f) of the DMCA any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "selected": false,
          "type": "_checkBox"
        },
        "user_undertaking_4": {
          "category": "userUnderTaking",
          "containerClasses": "mb-2",
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_4",
          "inputId": "user_undertaking_4",
          "key": "user_undertaking_4",
          "layout": "11.1.0",
          "label": "I understand that abuse of this tool will result in termination of my Walmart account.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "selected": false,
          "type": "_checkBox"
        },
        "fieldsHeader_4": {
          "containerClasses": "font-weight-bold mt-2",
          "header": "Typing your full name in this box will act as your digital signature",
          "layout": "12.1.0",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "_formFieldsHeader"
        },
        "signature": {
          "label": "Digital Signature",
          "containerClasses": "signature",
          "error": "",
          "disabled": false,
          "required": true,
          "inputId": "signature",
          "value": "",
          "key": "signature",
          "layout": "13.1.8",
          "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "text",
          "pattern": null,
          "subtitle": "",
          "onChange": "onChange"
        },
        "userActions": {
          "containerClasses": "modal-footer action-footer",
          "colClasses": "text-right",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "layout": "14.1.0",
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
              "classes": "btn btn-sm btn-primary submit-btn px-3 mx-3",
              "disabled": true,
              "renderCondition": "{\"keyPath\": \"brandNameSelected\", \"keyLocator\": \"state\", \"value\": true}",
              "text": "Submit",
              "type": "submit"
            }
          }
        }
      }
    },
    "RESETPASSWORD": {
      "sectionConfig": {
        "sectionTitle": "Change Password"
      },
      "formConfig": {
        "apiPath": "/api/users/resetPassword",
        "error": "",
        "formHeading": "Input the fields below to change your password. Your new password will be in effect next time you login.",
        "id": "resetPassword",
        "incorrectPasswordError": "Current password is incorrect.",
        "loader": false,
        "old5PasswordsError": "New password can not be 1 of your previous 5 passwords",
        "passwordsDifferent": false,
        "passwordChangedMessage": "Password Changed Successfully!",
        "failureMessage": "Unable to process your request, please try in sometime",
        "passwordGuidance": "",
        "passwordMismatchError": "\"New Password\" and \"Confirm Password\" do not match",
        "passwordPolicyMessage": "Password doesn't adhere to Walmart Brand Portal's Security policy.",
        "toastMessageExistingErrors": "Please resolve existing errors before proceeding!",
        "falconPasswordMismatchError": "Password did not match.",
        "falconPasswordPolicyError": "The specified password does not meet defined policy.",
        "falconSamePasswordError": "New password matches old password."
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
          "type": "_error"
        },
        "resetPasswordAction": {
          "containerClasses": "px-0 text-right",
          "colClasses": "reset-password-button-panel text-right",
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
        }
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
          "containerClasses": "password-reset-col",
          "colClasses": "",
          "layout": "1.1.6",
          "type": "_buttonsPanel",
          "buttons": {
            "changePassword": {
              "classes": "btn btn-outline-primary btn-sm px-3 reset-password",
              "onClick": "displayChangePassword",
              "renderCondition": "{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": false}",
              "text": "Change Password",
              "type": "button"
            },
            "manage": {
              "classes": "btn btn-primary btn-sm px-4 font-size-14 manage-profile",
              "onClick": "displayManageProfileNotification",
              "renderCondition": "{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": true}",
              "text": "Manage Seller Center Profile",
              "type": "submit"
            }
          }
        },
        "editActions": {
          "containerClasses": "h-40 text-right",
          "colClasses": "edit-button-panel text-right",
          "layout": "1.1.6",
          "type": "_buttonsPanel",
          "buttons": {
            "edit": {
              "classes": "btn btn-primary btn-sm px-4",
              "handlerArg": false,
              "onClick": "disableInput",
              "renderCondition": "[{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": true},{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": false}]",
              "text": "Edit",
              "type": "button"
            },
            "cancel": {
              "classes": "btn btn-link font-size-14 px-4 mr-3",
              "handlerArg": true,
              "renderCondition": "[{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": false},{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": false}]",
              "onClick": "disableInput",
              "text": "Cancel",
              "type": "button"
            },
            "save": {
              "classes": "btn btn-primary btn-sm px-4 font-size-14",
              "renderCondition": "[{\"keyPath\": \"state.form.isDisabled\", \"keyLocator\": \"parentRef\", \"value\": false},{\"keyPath\": \"state.isSeller\", \"keyLocator\": \"parentRef\", \"value\": false}]",
              "text": "Save",
              "type": "submit"
            }
          }
        }
      }
    },
    "WEBFORM": {
      "sectionConfig": {
        "headerClasses": "content-header-row h3 p-4",
        "formClasses": "row content-row p-4 mt-4"
      },
      "formConfig": {
        "actionsToDisable": ["submit"],
        "id": "webform",
        "loader": false,
        "isSubmitDisabled": true,
        "userTypeSelected": false,
        "claimTypeSelected": false,
        "showClaimIdentifierNumber": false,
        "counterfeitValidatorLength": 13,
        "counterfeitValidatorError": "Please enter valid order number",
        "formActions": "webformActions",
        "formError": "",
        "claimTypes": [
          {
            "claimType": "trademark",
            "claimTypeSectionHeader": "Trademark Information",
            "label": "Trademark",
            "claimTypeIdentifierLabel": "Trademark Number",
            "companyNameIdentifierLabel": "Trademark Company Name",
            "ownerNameIdentifierLabel": "Trademark Owner Name",
            "underTakingOwnerLabel": "trademark owner"
          },
          {
            "claimType": "patent",
            "claimTypeSectionHeader": "Patent Information",
            "label": "Patent",
            "claimTypeIdentifierLabel": "Patent Number",
            "companyNameIdentifierLabel": "Patent Company Name",
            "ownerNameIdentifierLabel": "Patent Owner Name",
            "underTakingOwnerLabel": "patent owner"
          },
          {
            "claimType": "counterfeit",
            "claimTypeSectionHeader": "Counterfeit Information",
            "label": "Counterfeit",
            "claimTypeIdentifierLabel": "Order Number",
            "companyNameIdentifierLabel": "Rights Owner Company Name",
            "ownerNameIdentifierLabel": "Rights Owner Name",
            "underTakingOwnerLabel": "intellectual property owner"
          },
          {
            "claimType": "copyright",
            "claimTypeSectionHeader": "Copyright Information",
            "label": "Copyright",
            "claimTypeIdentifierLabel": "",
            "companyNameIdentifierLabel": "Copyright Company Name",
            "ownerNameIdentifierLabel": "Copyright Owner Name",
            "underTakingOwnerLabel": "copyright owner"
          }
        ]
      },
      "fields": {
        "fieldsHeader_1": {
          "containerClasses": "font-weight-bold",
          "header": "Filing Claim As",
          "layout": "1.1.0",
          "type": "_formFieldsHeader"
        },
        "userType": {
          "containerClasses": "mb-3",
          "customChangeHandler": "customUserTypeChangeHandler",
          "disabled": false,
          "error": "",
          "inputId": "userType",
          "invalidError": "Please select user role",
          "key": "userType",
          "label": "User Type",
          "layout": "2.1.6",
          "onChange": "setSelectInputValue",
          "dropdownOptions": [
            {
              "id": "customer",
              "label": "Customer",
              "value": "Customer"
            },
            {
              "id": "rightsOwner",
              "label": "Rights Owner",
              "value": "Rights Owner"
            },
            {
              "id": "thirdParty",
              "label": "Third party",
              "value": "Third party"
            }
          ],
          "required": true,
          "type": "select",
          "preventHTMLRequiredValidation": true,
          "tooltipContent": "This is a test tooltip",
          "tooltipBody": [
            {
              "heading": "Rights Owner",
              "body": "Brand owners with registered trademarks."
            },
            {
              "heading": "Third Party representative",
              "body": "Authorized third-party brand protection agencies/ Legal representatives."
            },
            {
              "heading": "Customer",
              "body": "Walmart customer."
            }
          ],
          "value": ""
        },
        "fieldsHeader_2": {
          "containerClasses": "font-weight-bold",
          "header": "Type of infringement",
          "layout": "12.1.6",
          "type": "_formFieldsHeader"
        },
        "claimType": {
          "containerClasses": "mb-3",
          "customChangeHandler": "customChangeHandler",
          "disabled": false,
          "error": "",
          "inputId": "claimType",
          "key": "claimType",
          "label": "Claim type",
          "layout": "13.1.6",
          "onChange": "setSelectInputValue",
          "dropdownOptions": [],
          "required": true,
          "type": "select",
          "value": ""
        },
        "fieldsHeader_3": {
          "containerClasses": "font-weight-bold",
          "header": "Contact Information",
          "layout": "3.1.0",
          "type": "_formFieldsHeader"
        },
        "firstName": {
          "disabled": false,
          "error": "",
          "id": "firstName",
          "inputId": "firstName",
          "key": "firstName",
          "label": "First Name",
          "layout": "5.1.6",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "type": "text",
          "value": "",
          "initValuePath": "firstName",
          "validators": {
            "validateRequired": {
              "error": "First Name is required"
            },
            "validateRegex": {
              "dataRuleRegex": "^[a-zA-Z0-9\\- .]+$",
              "error": "Please enter a valid First Name"
            }
          }
        },
        "lastName": {
          "disabled": false,
          "error": "",
          "id": "lastName",
          "inputId": "lastName",
          "key": "lastName",
          "label": "Last Name",
          "layout": "5.2.6",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "type": "text",
          "value": "",
          "initValuePath": "lastName",
          "validators": {
            "validateRequired": {
              "error": "Last Name is required"
            },
            "validateRegex": {
              "dataRuleRegex": "^[a-zA-Z0-9\\- .]+$",
              "error": "Please enter a valid First Name"
            }
          }
        },
        "claimTypeSectionHeader": {
          "containerClasses": "font-weight-bold mt-2",
          "header": "Claim Type Information",
          "layout": "14.1.0",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "_formFieldsHeader"
        },
        "ownerName": {
          "disabled": false,
          "error": "",
          "id": "ownerName",
          "inputId": "ownerName",
          "key": "ownerName",
          "label": "Owner Name",
          "layout": "15.1.6",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "text",
          "value": "",
          "initValuePath": "ownerName",
          "validators": {
            "validateRequired": {
              "error": "Owner Name is required"
            }
          }
        },
        "companyName": {
          "disabled": false,
          "error": "",
          "id": "companyName",
          "inputId": "companyName",
          "invalidError": "Company Name is required",
          "key": "companyName",
          "label": "Company Name",
          "layout": "15.2.6",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "text",
          "value": "",
          "initValuePath": "companyName"
        },
        "brandName": {
          "disabled": false,
          "error": "",
          "inputId": "brandName",
          "invalidError": "Brand is required",
          "key": "brandName",
          "label": "Brand Name",
          "layout": "16.1.6",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "subtitle": "",
          "type": "text",
          "value": ""
        },
        "claimIdentifierNumber": {
          "disabled": false,
          "error": "",
          "inputId": "claimIdentifierNumber",
          "key": "claimIdentifierNumber",
          "label": "Claim Type Identifier Number",
          "layout": "16.2.6",
          "preventHTMLRequiredValidation": true,
          "required": {"default": false, "condition": [{"keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": ["patent", "trademark"], "value": true}]},
          "renderCondition": "[{\"keyPath\": \"form.inputData.userType.value\", \"keyLocator\": \"state\", \"value\": [\"third party\",\"rights owner\"]}, {\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": [\"counterfeit\", \"patent\", \"trademark\"]}]||{\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": \"counterfeit\"}",
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateLength":{
              "evaluator": {"default": 30, "condition": [
                {
                  "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "counterfeit",
                  "setFields": [{"field": "maxLength","value": 13}, {"field": "error", "value": "Please enter valid order number"}]
                },
                {
                  "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "trademark",
                  "setFields": [{"field": "maxLength","value": 30}, {"field": "error", "value": "Please enter valid Trademark Number"}]
                },
                {
                  "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "patent",
                  "setFields": [{"field": "maxLength","value": 30}, {"field": "error", "value": "Please enter valid Patent Number"}]
                }
              ]}
            },
            "validateRegex": {
              "evaluator": {
                "default": "", "condition": [
                  {
                    "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "trademark",
                    "setFields": [{
                      "field": "dataRuleRegex",
                      "value": "^[a-zA-Z0-9-.!\"#$%&'()*+,\/]+$"
                    }, {"field": "error", "value": "Please enter a valid Trademark Number"}]
                  },
                  {
                    "keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "patent",
                    "setFields": [{
                      "field": "dataRuleRegex",
                      "value": "^[a-zA-Z0-9-.!\"#$%&'()*+,\/]+$"
                    }, {"field": "error", "value": "Please enter a valid Patent Number"}]
                  }
                ]
              }
            }
          }
        },
        "address_1": {
          "disabled": false,
          "error": "",
          "inputId": "address_1",
          "key": "address_1",
          "label": "Address 1",
          "layout": "8.1.6",
          "prebounceChangeHandler": "trimSpaces",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Address 1 is required"
            }
          }
        },
        "address_2": {
          "disabled": false,
          "error": "",
          "inputId": "address_2",
          "key": "address_2",
          "label": "Address 2",
          "layout": "8.2.6",
          "prebounceChangeHandler": "trimSpaces",
          "preventHTMLRequiredValidation": true,
          "required": false,
          "subtitle": "",
          "type": "text",
          "value": ""
        },
        "city": {
          "disabled": false,
          "error": "",
          "inputId": "city",
          "key": "city",
          "label": "City",
          "layout": "9.1.6",
          "prebounceChangeHandler": "trimSpaces",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "City is required"
            }
          }
        },
        "country": {
          "disabled": false,
          "error": "",
          "inputId": "country",
          "key": "country",
          "label": "Country",
          "layout": "9.2.6",
          "prebounceChangeHandler": "trimSpaces",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "USA",
          "validators": {
            "validateRequired": {
              "error": "Country is required"
            },
            "validateRegex": {
              "dataRuleRegex": "^[a-zA-Z\\s]+$",
              "error": "Please enter a valid Country name"
            },
            "validateLength": {
              "minLength": "2",
              "error": "Minimum length is 2 characters"
            }
          }
        },
        "state": {
          "colClasses": "col-6",
          "disabled": false,
          "error": "",
          "inputId": "state",
          "key": "state",
          "label": "State",
          "layout": "10.1.6",
          "prebounceChangeHandler": "trimSpaces",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "State/Province/Region is required"
            }
          }
        },
        "zip": {
          "colClasses": "col-6",
          "disabled": false,
          "error": "",
          "inputId": "zip",
          "key": "zip",
          "label": "ZIP",
          "layout": "10.2.6",
          "maxLength": 10,
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Zip/Postal Code is required"
            },
            "validateRegex": {
              "dataRuleRegex": "^[a-zA-Z0-9]+$",
              "error": "Please enter a valid Zip Code"
            },
            "validateLength": {
              "minLength": "3",
              "error": "Minimum length is 3 characters"
            }
          }
        },
        "phone": {
          "disabled": false,
          "disableDefaultBlurValidation": true,
          "error": "",
          "fieldOk": false,
          "id": "phone",
          "inputId": "phone",
          "isUnique": true,
          "key": "phone",
          "label": "Phone Number",
          "layout": "11.1.6",
          "maxLength": 15,
          "prebounceChangeHandler": "prebounceChangeHandler",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Phone number is required"
            },
            "validateRegex": {
              "dataRuleRegex": "^[0-9]+$",
              "error": "Please enter all numbers."
            },
            "validateLength": {
              "minLength": "7",
              "error": "Minimum length is 7 characters"
            }
          }
        },
        "emailId": {
          "containerClasses": "contact-details",
          "disabled": false,
          "disableDefaultBlurValidation": true,
          "error": "",
          "id": "emailId",
          "inputId": "emailId",
          "key": "emailId",
          "label": "Email Address",
          "layout": "11.2.6",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Email address is required"
            },
            "validateRegex": {
              "dataRuleRegex": "(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))",
              "error": "Please enter a valid Email Address"
            }
          }
        },
        "fieldsHeader_6": {
          "containerClasses": "font-weight-bold",
          "header": "Claim Information",
          "layout": "17.1.0",
          "renderCondition": "{\"keyPath\": \"form.claimType\", \"keyLocator\": \"state\", \"hasValue\": true}",
          "type": "_formFieldsHeader"
        },
        "urlItems": {
          "disableAddItem": true,
          "error": "",
          "fieldLoader": false,
          "inputId": "items",
          "isSellerNameDisabled": false,
          "layout": "18.1.0",
          "key": "items",
          "maxItems": 10,
          "onChangeItem": "getItemListFromChild",
          "prebounceChangeHandler": "disableSubmitButton",
          "onChangeSellerName": "onChange",
          "onChangeUrl": "onChange",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "required": true,
          "type": "_urlItems",
          "itemList": [
            {
              "id": "item-0",
              "url": {
                "invalidError": "Please adhere to URL format",
                "label": "Item URL",
                "required": true,
                "value": "",
                "type": "url",
                "pattern": "https?://www.walmart.com/.*",
                "patternErrorMessage": "Please adhere to URL format",
                "preventHTMLRequiredValidation": true,
                "disabled": false,
                "isValid": false,
                "subtitle": "",
                "error": "",
                "validators": {
                  "validateRequired": {
                    "error": "Item URL is required"
                  }
                }
              },
              "sellerName": {
                "label": "Seller Name",
                "required": true,
                "value": "",
                "disabled": false,
                "dropdownOptions": [],
                "subtitle": "",
                "type": "text",
                "error": "",
                "preventHTMLRequiredValidation": true,
                "validators": {
                  "validateRequired": {
                    "error": "Seller Name is required"
                  },
                  "validateLength": {
                    "minLength": "3",
                    "error": "Minimum length is 3 characters"
                  }
                }
              }
            }
          ]
        },
        "webformDoc": {
          "buttonText": "Upload",
          "cancelHandlerArg": "webformDoc",
          "changeHandlerArg": "webformDoc",
          "disabled": false,
          "error": "",
          "endpoint": "/api/claims/uploadWebFormDocument",
          "filename": "",
          "icon": "Question",
          "id": "",
          "inputId": "webformDoc",
          "key": "webformDoc",
          "label": "Attach Documents (Optional)",
          "layout": "19.1.0",
          "onCancel": "cancelSelection",
          "onChange": "displayProgressAndUpload",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "tooltipContentKey": "webformDocContent",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
        "comments": {
          "disabled": false,
          "error": "",
          "inputId": "comments",
          "key": "comments",
          "layout": "20.1.0",
          "label": "Comments",
          "maxLength": 3000,
          "pattern": null,
          "required": true,
          "onChange": "onChange",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "rowCount": 2,
          "placeholder": {"default": "Please provide additional information about the claim",
            "condition": [{"keyPath": "form.inputData.claimType.value", "keyLocator": "state", "dependencyValue": "counterfeit", "value": "If possible, please provide evidence that the reported listing is selling a counterfeit product, such as the order number and/or description of the counterfeit item received."}]},
          "prebounceChangeHandler": "trimSpaces",
          "preventHTMLRequiredValidation": true,
          "subtitle": "",
          "type": "textarea",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Please be sure to provide details regarding your claim."
            },
            "validateLength": {
              "minLength": 20,
              "maxLength": 3000,
              "error": "Comment should be 20 characters long!"
            }
          }
        },
        "user_undertaking_1": {
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_1",
          "inputId": "user_undertaking_1",
          "key": "user_undertaking_1",
          "layout": "21.1.0",
          "label": "",
          "originalLabel": "I have a good faith belief that the use of the material in the manner complained of is not authorized by the __owner_label__, its agent, or the law.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "selected": false,
          "type": "_checkBox",
          "validators": {
            "validateRequired": {
              "error": "You must agree to this statement to submit a report"
            }
          }
        },
        "user_undertaking_2": {
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_2",
          "inputId": "user_undertaking_2",
          "key": "user_undertaking_2",
          "layout": "22.1.0",
          "label": "This notification is accurate; and UNDER PENALTY OF PERJURY, I am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "selected": false,
          "type": "_checkBox",
          "validators": {
            "validateRequired": {
              "error": "You must agree to this statement to submit a report"
            }
          }
        },
        "user_undertaking_3": {
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_3",
          "inputId": "user_undertaking_3",
          "key": "user_undertaking_3",
          "layout": "23.1.0",
          "label": "I acknowledge that under Section 512(f) of the DMCA any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.inputData.claimType.value\", \"keyLocator\": \"state\", \"value\": \"Copyright\"}",
          "selected": false,
          "type": "_checkBox",
          "validators": {
            "validateRequired": {
              "error": "You must agree to this statement to submit a report"
            }
          }
        },
        "user_undertaking_4": {
          "checkBoxClasses": "user-undertaking",
          "excludeRowContainer": true,
          "excludeColContainer": true,
          "id": "user_undertaking_4",
          "inputId": "user_undertaking_4",
          "key": "user_undertaking_4",
          "layout": "24.1.0",
          "label": "I understand that abuse of this tool will result in termination of my Walmart account.",
          "labelClasses": "user-undertaking-label",
          "onChange": "undertakingtoggle",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "selected": false,
          "type": "_checkBox",
          "validators": {
            "validateRequired": {
              "error": "You must agree to this statement to submit a report"
            }
          }
        },
        "fieldsHeader_4": {
          "containerClasses": "font-weight-bold mt-2",
          "header": "Typing your full name in this box will act as your digital signature",
          "layout": "25.1.0",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "_formFieldsHeader"
        },
        "digitalSignature": {
          "disabled": false,
          "containerClasses": "",
          "disableDefaultBlurValidation": true,
          "error": "",
          "inputId": "digitalSignature",
          "key": "digitalSignature",
          "layout": "26.1.8",
          "label": "Digital Signature",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "text",
          "value": "",
          "validators": {
            "validateRequired": {
              "error": "Digital Signature is required"
            }
          }
        },
        "fieldsHeader_5": {
          "containerClasses": "font-weight-bold",
          "colClasses": "pt-2",
          "header": "Please review your contact information and make sure it's correct before clicking \"Submit Claim\"",
          "layout": "28.1.8",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "type": "_formFieldsHeader"
        },
        "webformActions": {
          "containerClasses": "pb-5 mb-5",
          "colClasses": "web-form-button-panel text-right",
          "layout": "28.2.4",
          "type": "_buttonsPanel",
          "renderCondition": "{\"keyPath\": \"form.claimTypeSelected\", \"keyLocator\": \"state\", \"value\": true}",
          "buttons": {
            "submit": {
              "classes": "btn btn-primary padded-button",
              "disabled": false,
              "onClick": "handleSubmit",
              "text": "Submit Claim",
              "type": "submit"
            }
          }
        }
      }
    },
    "CONTACTUS": {
      "formConfig": {
        "api": "/api/users/contactUs",
        "id": "contactUs",
        "isSubmitDisabled": true,
        "loader": false,
        "successNotificationMessage": "Request successfully submitted. Our agents will process your request",
        "failedNotificationMessage": "Sorry request cannot be processed at the moment"
      },
      "fields": {
        "area": {
          "containerClasses": "mt-4 contact-us-form-row w-100",
          "colClasses": "contact-us-form-area",
          "disabled": false,
          "dropdownOptions": [
            {
              "id": "technicalSupport",
              "label": "Technical Support",
              "value": "Technical Support"
            },
            {
              "label": "Claim Support",
              "value": "Claim Support",
              "id": "claimSupport"
            },
            {
              "label": "User Management Support",
              "value": "User Management Support",
              "id": "userManagementSupport"
            },
            {
              "label": "Follow-Up",
              "value": "Follow-Up",
              "id": "followUp"
            },
            {
              "label": "IP Management Support",
              "value": "IP Management Support",
              "id": "ipManagementSupport"
            },
            {
              "label": "Other",
              "value": "Other",
              "id": "other"
            }
          ],
          "error": "",
          "fieldOk": false,
          "inputId": "area",
          "key": "area",
          "label": "Area",
          "layout": "1.1.5",
          "invalidError": "Please select from the drop down",
          "patternErrorMessage": "Please select from the drop down.",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "select",
          "tooltipContent": "",
          "value": ""
        },
        "title": {
          "containerClasses": " contact-us-form-row w-100",
          "colClasses": "contact-us-form-title",
          "disabled": false,
          "error": "",
          "fieldOk": false,
          "inputId": "title",
          "invalidError": "Please provide a short description of the request",
          "key": "title",
          "label": "Title",
          "layout": "2.0.5",
          "patternErrorMessage": "Please provide a short description of the request",
          "preventHTMLRequiredValidation": true,
          "required": true,
          "subtitle": "",
          "type": "text",
          "value": "",
          "validators": {
            "validateLength": {
              "maxLength": 60,
              "error": "Max. length is 60"
            }
          }
        },
        "details": {
          "containerClasses": "contact-us-form-row w-100",
          "colClasses": "contact-us-form-details",
          "error": "",
          "inputId": "details",
          "invalidError": "Please provide additional information about the request",
          "key": "details",
          "label": "Details",
          "layout": "3.0.7",
          "patternErrorMessage": "Please provide additional information about the request",
          "preventHTMLRequiredValidation": true,
          "placeholder": "Please provide additional information about the request",
          "required": true,
          "subtitle": "",
          "type": "textarea",
          "value": "",
          "validators": {
            "validateLength": {
              "maxLength": 1000,
              "minLength": 20,
              "error": "Details should be between 20 to 1000 characters long."
            }
          }
        },
        "sendActions": {
          "containerClasses": "contact-us-form-row w-100 m-0",
          "colClasses": "contact-us-button-panel text-right",
          "layout": "4.0.7",
          "type": "_buttonsPanel",
          "buttons": {
            "send": {
              "classes": "btn btn-primary btn-sm px-4 font-size-14",
              "text": "Send",
              "type": "submit"
            }
          }
        }
      }
    }
  }
};
export default FORMFIELDCONFIG;
