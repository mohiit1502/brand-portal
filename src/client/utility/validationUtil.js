/* eslint-disable max-statements */
/* eslint-disable no-unused-expression, max-params, no-magic-numbers, no-unused-expressions */
import Http from "./Http";
import Helper from "./helper";
import { NOTIFICATION_TYPE } from "../actions/notification/notification-actions";
import CONSTANTS from "../constants/constants";
import mixpanel from "./mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";
import ContentRenderer from "./ContentRenderer";

export default class Validator {

  static errorPrefix = "Error: ";

  static validate(evt, parentRef) {
    const { validators } = this.props;
    let errorMsg;
    validators && Object.keys(validators).every(validation => {
      errorMsg = Validator[validation](evt.target, validators[validation], parentRef);
      this.setState({ error: errorMsg });
      return !errorMsg;
    });
    return errorMsg;
  }

  static validateRequired(target, validationObj) {
    const formFieldValue = target.value;
    if (validationObj && formFieldValue === "") {
      return validationObj.error;
    } else {
      return "";
    }
  }

  static validateLength(target, validationObj) {
    const value = target.value ? target.value.trim() : "";
    const length = value.length;
    if (
      (validationObj && (validationObj.minLength && length < validationObj.minLength)) ||
      (validationObj.maxLength && length > validationObj.maxLength)
    ) {
      return validationObj.error;
    } else {
      return "";
    }
  }

  static validateUrl(target){
    const formFieldRegex = new RegExp("https:\/\/www.walmart.com\/.+");
    return formFieldRegex.test(target.value);

  }

  static validateRegex(target, validationObj, parentRef, regexSelector) {
    const formFieldValue = target.value.trim();
    if (validationObj) {
      const formFieldRegexString =
        validationObj.dataRuleRegex &&
        (validationObj.dataRuleRegex[regexSelector]
          ? validationObj.dataRuleRegex[regexSelector]
          : validationObj.dataRuleRegex);
      const formFieldRegex = new RegExp(formFieldRegexString);
      const compliesRegex = formFieldRegex.test(formFieldValue);
      if (!compliesRegex) {
        return validationObj.error;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  /* eslint-disable mo-magic-numbers */
  static validateDate(target, validationObj) {
    const formFieldValue = target.value;
    if (validationObj) {
      const month = +formFieldValue.substring(0, formFieldValue.indexOf("/"));
      const year = +formFieldValue.substring(formFieldValue.indexOf("/") + 1);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      if (year > 2032 || month > 12 || month < 1) {
        return validationObj.error;
      }
      if (year < currentYear || (year === currentYear && month < currentMonth + 1)) {
        return validationObj.error;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  static validatePasswordMatch(target, validationObj, parentRef) {
    const form = parentRef.state.form;
    const sibling = Helper.search(validationObj.siblingField, parentRef);
    if (sibling && sibling.isDirty) {
      form.passwordsDifferent = target.value !== sibling.value;
      parentRef.setState({ form });
    }
  }

  static validateState() {
    const matchForm = { ...this.state.form };
    const writeForm = { ...this.state.form };
    matchForm.inputData = { ...matchForm.inputData };
    Object.keys(matchForm.inputData).forEach(key => matchForm.inputData[key] = ContentRenderer.hookConditionInterceptor.call(this, matchForm.inputData[key], ["required"]))
    let hasError = false;
    /* eslint-disable complexity */
    Object.keys(matchForm.inputData).forEach(key => {
      const obj = { ...matchForm.inputData[key] };
      if (obj.error && (!obj.renderCondition || (obj.renderCondition && ContentRenderer.evaluateRenderDependency.call(this, obj.renderCondition)))) {
        hasError = true;
        return;
      }
      if (obj && obj.required && !obj.value) {
        if (!((key === "companyName" && this.props.userProfile && this.props.userProfile.type === "Internal")
          || (obj.type === "_checkBox" && (!obj.renderCondition || (obj.renderCondition && ContentRenderer.evaluateRenderDependency.call(this, obj.renderCondition)))
            && obj.selected))) {
          if (obj.type && obj.type === "_urlItems") {
            if(!obj.renderCondition || (obj.renderCondition && ContentRenderer.evaluateRenderDependency.call(this, obj.renderCondition))){
                obj.itemList && obj.itemList.forEach(item => {
                  const urlObj = item.url;
                  const sellerNameObj = item.sellerName;
                  // if(validate)
                  if(urlObj && (urlObj.error || (urlObj.required && !urlObj.value))){
                    urlObj.error = urlObj.error || urlObj.invalidError || "Please Enter Valid Input";
                    hasError = true;
                  }
                  if(sellerNameObj && (sellerNameObj.error || (sellerNameObj.required && !sellerNameObj.value))){
                    sellerNameObj.error = sellerNameObj.error || sellerNameObj.invalidError || "Please Enter Valid Input";
                    hasError = true;
                  }
                })
            }
          } else {
            const obj = writeForm.inputData[key];
            if((!obj.renderCondition) ||  (obj.renderCondition && ContentRenderer.evaluateRenderDependency.call(this,obj.renderCondition))){
              obj.error = obj.error || (obj.validators && obj.validators.validateRequired && obj.validators.validateRequired.error) || obj.invalidError || "Please Enter Valid Input";
              hasError = true;
            }
          }
        }
      } else {
        const obj = writeForm.inputData[key];
        obj.error = obj.error || "";
      }
    });
    this.setState({ writeForm });
    return hasError;
  }

  static onInvalid(evt, key, innerKey) {
    evt.preventDefault();
    const form = this.state.form;
    const matchedObj = Helper.search(key, form.inputData);
    if (matchedObj) {
      matchedObj.error = matchedObj.invalidError ? matchedObj.invalidError : Helper.search(matchedObj.invalidErrorPath);
      this.invalid[innerKey || key] = true;
      this.setState({ form });
    }
  }

  // =============================== Backend Validations ====================================
  static checkBrandUniqueness(params) {
    if (!this.state.form.inputData.brandName.value) return;
    const isEditMode = this.props.userProfile && this.props.userProfile.context === "edit";
    const state = { ...this.state };
    const form = { ...state.form };
    const inputData = { ...form.inputData };

    if (!isEditMode || (isEditMode && this.props.originalValues && this.props.originalValues.brand && this.props.originalValues.brand.name && this.state.form.inputData.brandName
      && this.state.form.inputData.brandName.value && this.props.originalValues.brand.name.trim() !== this.state.form.inputData.brandName.value.trim())) {
      state.form = form;
      form.inputData = inputData;
      inputData.brandName.loader = true;
      inputData.brandName.disabled = true;
      this.setState(state);
      params.clientType = this.props.clientType;
      const mixpanelPayload = {
        API: "/api/brands/checkUnique",
        BRAND_NAME: params.brandName,
        WORK_FLOW: MIXPANEL_CONSTANTS.WORK_FLOW_MAPPING[state.form.id]
      };
      Http.get("/api/brands/checkUnique", params, null, this.props.showNotification, null, inputData.brandName.ERROR5XX)
        .then(res => {
          const error = res.body.unique ? "" : "This brand is already registered in your Walmart Brand Portal account";
          inputData.brandName.isUnique = res.body.unique;
          inputData.brandName.error = error;
          inputData.brandName.fieldOk = !error;
          inputData.brandName.disabled = false;
          inputData.brandName.loader = false;
          mixpanelPayload.API_SUCCESS = true;
          mixpanelPayload.IS_BRAND_NAME_UNIQUE = res.body.unique;
        })
        .catch(err => {
          inputData.brandName.isUnique = false;
          inputData.brandName.error = false;
          inputData.brandName.fieldOk = false;
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          inputData.brandName.disabled = false;
          inputData.brandName.loader = false;
          this.setState(state, this.checkToEnableSubmit);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.VALIDATION_EVENTS.BRAND_UNIQUENESS_CHECK, mixpanelPayload);
        });
    } else {
      inputData.brandName.disabled = false;
      inputData.brandName.loader = false;
      state.form.inputData.brandName.isUnique = true;
      state.form.inputData.trademarkNumber.isValid = true;
      this.setState(state, () => {
        this.checkToEnableSubmit();
      });
    }
  }

  static checkTrademarkValidity() {
    if (!this.state.form.inputData.trademarkNumber.value) return;
    const state = { ...this.state };
    const form = { ...state.form };
    const inputData = { ...form.inputData };
    state.form = form;
    form.inputData = inputData;
    inputData.trademarkNumber.loader = true;
    inputData.trademarkNumber.disabled = true;
    inputData.trademarkNumber.fieldOk = false;
    this.setState(state);
    const mixpanelPayload = {
      API: "/api/brand/trademark/validity/",
      TRADEMARK_NUMBER: this.state.form.inputData.trademarkNumber.value,
      WORK_FLOW: MIXPANEL_CONSTANTS.WORK_FLOW_MAPPING[state.form.id]
    };
    Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`,
      { clientType: this.props.clientType }, null, this.props.showNotification, null, inputData.trademarkNumber.ERROR5XX)
      .then(res => {
        Validator.processTMUniquenessAPIResponse.call(this, res, inputData.trademarkNumber);
        mixpanelPayload.API_SUCCESS = true;
        mixpanelPayload.USPTO_VERIFICATION_STATUS = res.body.usptoVerification;
        mixpanelPayload.USPTO_URL = res.body.usptoUrl;
        mixpanelPayload.IS_VALID_TRADEMARK = (res.body.usptoVerification === "VALID" || res.body.usptoVerification === "NOT_VERIFIED");
      })
      .catch(err => {
        inputData.trademarkNumber.isValid = true;
        inputData.trademarkNumber.error = false;
        inputData.trademarkNumber.fieldOk = false;
        inputData.trademarkNumber.fieldAlert = false;
        inputData.trademarkNumber.disabled = false;
        inputData.trademarkNumber.loader = false;
        inputData.trademarkNumber.usptoUrl = "";
        inputData.trademarkNumber.usptoVerification = "NOT_VERIFIED";
        mixpanelPayload.API_SUCCESS = false;
        mixpanelPayload.ERROR = err.message ? err.message : err;
      })
      .finally(() => {
        inputData.trademarkNumber.disabled = false;
        inputData.trademarkNumber.loader = false;
        this.setState(state, this.checkToEnableSubmit);
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.VALIDATION_EVENTS.TRADEMARK_VALIDITY, mixpanelPayload);
      });
  }

  // eslint-disable-next-line max-statements
  static checkCompanyNameAvailability() {
    const isEditMode = this.props.userProfile && this.props.userProfile.context === "edit";
    const state = { ...this.state };
    const form = { ...this.state.form };
    const inputData = { ...this.state.form.inputData };

    if ((isEditMode && this.props.originalValues && this.props.originalValues.org && this.props.originalValues.org.name
      && this.props.originalValues.org.name.trim() !== this.state.form.inputData.companyName.value.trim()) || !isEditMode) {
      if (!this.state.form.inputData.companyName.value) return;
      state.form = form;
      form.inputData = inputData;
      inputData.companyName.disabled = true;
      inputData.companyName.loader = true;
      inputData.companyOnboardingActions.buttons = { ...inputData.companyOnboardingActions.buttons };
      //inputData.companyOnboardingActions.buttons.clear.disabled = true;
      this.setState(state);
      let error;
      const mixpanelPayload = {
        API: "/api/company/availability",
        COMPANY_NAME: this.state.form.inputData.companyName.value,
        WORK_FLOW: MIXPANEL_CONSTANTS.WORK_FLOW_MAPPING[state.form.id]
      };

      Http.get("/api/company/availability", { name: this.state.form.inputData.companyName.value, clientType: this.state.clientType })
        .then(response => {
          error = response.body.unique ? "" : `"${response.body.name}" already has a Walmart Brand Portal account. For more information please contact ipinvest@walmart.com.`;
          inputData.companyName.isUnique = !error;
          inputData.companyName.fieldOk = !error;
          //inputData.companyOnboardingActions.buttons.clear.disabled = false;
          mixpanelPayload.API_SUCCESS = true;
          mixpanelPayload.IS_COMPANY_NAME_UNIQUE = response.body.unique;
        }).catch(err => {
          error = err.error;
          if (error) {
            /* eslint-disable no-nested-ternary */
            error = typeof error === "object" ? error.message ? error.message : "Uniqueness Check Failed, please try again!" : error;
          }
          inputData.companyName.isUnique = false;
          inputData.companyName.fieldOk = false;
          inputData.companyName.requestAdministratorAccess = true;
          //inputData.companyOnboardingActions.buttons.clear.disabled = false;
          this.props.showNotification(NOTIFICATION_TYPE.ERROR, "Uniqueness Check Failed, please try again!");
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
          inputData.companyName.error = error;
          inputData.companyName.disabled = false;
          inputData.companyName.loader = false;
          this.setState(state, inputData.companyName.isUnique ? () => {
            this.toggleFormEnable(!error, !error, false);
            this.checkToEnableSubmit();
          } : () => { });
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.VALIDATION_EVENTS.COMPANY_NAME_AVAILABILITY_CHECK, mixpanelPayload);
        });
    }
    else {
      inputData.companyName.disabled = false;
      inputData.companyName.loader = false;
      this.setState(state, () => {
        this.toggleFormEnable(true, true, false);
        this.checkToEnableSubmit();
      });
    }
  }

  static onEmailChange() {
    const form = { ...this.state.form };
    const inputData = { ...this.state.form.inputData };
    const emailId = inputData.emailId;
    if (!emailId.value || emailId.error) return;
    form.inputData = inputData;
    emailId.disabled = true;
    emailId.loader = true;
    let uniquenessCheckStatus;
    this.setState({ form });
    const mixpanelPayload = {
      API: "/api/users/checkUnique",
      EMAIL_ID: inputData.emailId.value,
      WORK_FLOW: MIXPANEL_CONSTANTS.WORK_FLOW_MAPPING[this.state.form.id]
    };
    if (emailId.value && emailId.error !== emailId.invalidError) {
      this.loader("fieldLoader", true);
      Http.get("/api/users/checkUnique", { email: emailId.value }).then(res => {
        const unique = res.body.uniquenessStatus !== CONSTANTS.USER.UNIQUENESS_CHECK_STATUS.DENY;
        const error = !unique ? "This email already exists in the Walmart Brand Portal." : "";
        emailId.disabled = false;
        emailId.loader = false;
        emailId.value = emailId.value ? emailId.value.toLowerCase() : emailId.value;
        emailId.error = emailId.error !== emailId.invalidError && error;
        emailId.isUnique = unique;
        emailId.fieldOk = !error;
        uniquenessCheckStatus = res.body.uniquenessStatus;
        mixpanelPayload.API_SUCCESS = true;
        mixpanelPayload.IS_EMAIL_UNIQUE = unique;
      }).catch(err => {
        emailId.fieldOk = false;
        mixpanelPayload.API_SUCCESS = false;
        mixpanelPayload.ERROR = err.message ? err.message : err;
      })
        .finally(() => {
          emailId.disabled = false;
          emailId.loader = false;
          this.setState({ form, uniquenessCheckStatus }, this.checkToEnableSubmit);
          mixpanel.trackEvent(MIXPANEL_CONSTANTS.VALIDATION_EVENTS.EMAIL_VALIDITY_CHECK, mixpanelPayload);
        });
    }
  }

  static processTMUniquenessAPIResponse(res, tmMeta) {
    let error;
    if (res.body.usptoVerification === "VALID" || res.body.usptoVerification === "NOT_VERIFIED") {
      error = "";
    } else {
      error = tmMeta[res.body.usptoVerification];
      if (error && error.indexOf("__trademarkNumber__") !== -1) {
        error = error.replace("__trademarkNumber__", res.body.ipNumber);
      }
    }
    tmMeta.isValid = res.body.usptoVerification === "VALID" || res.body.usptoVerification === "NOT_VERIFIED";
    tmMeta.error = error;
    tmMeta.fieldOk = res.body.usptoVerification === "VALID";
    tmMeta.fieldAlert = res.body.usptoVerification === "NOT_VERIFIED";
    tmMeta.usptoUrl = res.body.usptoUrl;
    tmMeta.usptoVerification = res.body.usptoVerification;
  }
}
