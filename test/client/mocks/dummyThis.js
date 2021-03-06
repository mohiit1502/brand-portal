import userProfile from "./userProfile";

const dummyThis = {
  state: {
    isSeller: false,
    clientType: "seller",
    columns: [],
    form: {
      isDisabled: true,
      actionsToDisable: ["clear"],
      formActions: "companyOnboardingActions",
      inputData: {
        username: {
          value: "username",
          layout: "1.1.6",
          required: true,
          key: "username",
          invalidErrorPath: "CONSTANTS.ERRORMESSAGES.EMAILERROR",
          validators: {
            validateRequired: {
              error: "required error"
            }
          }
        },
        password: {
          isDirty: true,
          layout: "1.2.6",
          invalidError: "test error",
          value: "test123",
          required: true,
          key: "password"
        },
        companyName: {
          isDirty: true,
          value: "test-company-1",
          required: true,
          key: "companyName",
          renderCondition: "{\"keyPath\": \"state.form.inputData.userType.value\", \"keyLocator\": \"parentRef\", \"value\": \"internal\"}",
        },
        urlItems: {
          isDirty: true,
          value: "test items",
          required: true,
          key: "urlItems",
          type: "_urlItems"
        },
        userType: {
          changeHandlerArg: "test",
          onChange: "onChange",
          onInvalid: "onInvalid",
          onKeyPress: "onKeyPress",
          value: "ThirdParty",
          key: "userType",
          required: true
        },
        claimType: {
          value: "counterfeit",
          onChange: "onChange",
          key: "claimType",
          required: true,
          type: "_checkBox",
          renderCondition: "{\"keyPath\": \"state.form.inputData.userType.value\", \"keyLocator\": \"parentRef\", \"value\": \"thirdparty\"}",
        },
        brandName: {
          value: "brandName",
          key: "brandName",
          invalidErrorPath: "CONSTANTS.ERRORMESSAGES.EMAILERROR",
          required: true,
          validators: {
            validateRequired: {
              error: "required error"
            }
          }
        },
        trademarkNumber: {
          value: "trademarkNumber",
          required: true,
          key: "trademarkNumber",
          invalidErrorPath: "CONSTANTS.ERRORMESSAGES.EMAILERROR",
          INVALID: "got error: __trademarkNumber__",
          validators: {
            validateRequired: {
              error: "required error"
            }
          }
        },
        emailId: {
          value: "emailId",
          error: "",
          invalidError: "Please enter valid email",
          required: true,
          key: "emailId",
          invalidErrorPath: "CONSTANTS.ERRORMESSAGES.EMAILERROR",
          validators: {
            validateRequired: {
              error: "required error"
            }
          }
        },
        companyOnboardingActions: {
          buttons: {
            clear: {},
            submit: {}
          }
        },
        "additionalDoc": {},
        "businessRegistrationDoc": {
          "accept": "application/msword,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/pdf,image/*",
          "buttonText": "Upload",
          "otherType": "additionalDoc",
          "cancelHandlerArg": "businessRegistrationDoc",
          "changeHandlerArg": "businessRegistrationDoc",
          "disabled": true,
          "endpoint": "/api/company/uploadBusinessDocument",
          "error": "",
          "filename": "",
          "icon": "Question",
          "allowedFileSize": 7,
          "fileValidationError": "Please follow the guidelines to upload attachments.",
          "id": "",
          "inputId": "businessRegistrationDoc",
          "key": "businessRegistrationDoc",
          "label": "Optional: Attach additional documents if necessary (i.e. business registration)",
          "layout": "5.1.0",
          "onCancel": "cancelSelection",
          "onChange": "displayProgressAndUpload",
          "tooltipContentKey": "businessDocContent",
          "type": "_fileUploader",
          "uploading": false,
          "uploadPercentage": 0
        },
      }
    }
  },
  props: {
    userProfile,
    clientType: "test",
    originalValues: {
      brand: {
        name: "test-brand-1"
      },
      org: {
        name: "test-org-1"
      }
    },
    showNotification: jest.fn()
  },
  conditionalFields: ["textObj", "renderCondition", "header", "label", "placeholder", "required", "validators", "value"],
  checkToEnableSubmit: jest.fn(),
  toggleFormEnable: jest.fn(),
  loader: jest.fn()
}

export default dummyThis;
