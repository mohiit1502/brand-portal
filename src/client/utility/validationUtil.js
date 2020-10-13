import Http from "./Http";
import Helper from "./helper";
import { NOTIFICATION_TYPE } from "../actions/notification/notification-actions";

export default class Validator {

  static errorPrefix = "Error: ";


  static validate(evt, parentRef) {
    const {validators} = this.props;
    let errorMsg;
    validators && Object.keys(validators).every(validation => {
      errorMsg = Validator[validation](evt.target, validators[validation], parentRef)
      this.setState({error: errorMsg})
      return !errorMsg;
    });
    return errorMsg;
  }

  static validateRequired (target, validationObj) {
    const formFieldValue = target.value
    if (validationObj && formFieldValue === "") {
      return Validator.errorPrefix + validationObj.errorMessages.dataMsgRequired
    } else {
      return ""
    }
  }

  static validateLength (target, validationObj) {
    const length = target.value ? target.value.length : 0
    if (
      (validationObj && (validationObj.minLength && length < validationObj.minLength)) ||
      (validationObj.maxLength && length > validationObj.maxLength)
    ) {
      return Validator.errorPrefix + validationObj.error
    } else {
      return ""
    }
  }

  static validateRegex (target, validationObj, regexSelector) {
    const formFieldValue = target.value
    if (validationObj) {
      const formFieldRegexString =
        validationObj.dataRuleRegex &&
        (validationObj.dataRuleRegex[regexSelector]
          ? validationObj.dataRuleRegex[regexSelector]
          : validationObj.dataRuleRegex)
      const formFieldRegex = new RegExp(formFieldRegexString)
      const compliesRegex = formFieldRegex.test(formFieldValue)
      if (!compliesRegex) {
        return Validator.errorPrefix + validationObj.errorMessages.dataMsgRegex
      } else {
        return ""
      }
    } else {
      return ""
    }
  }

  static validateDate (target, validationObj) {
    const formFieldValue = target.value
    if (validationObj) {
      const month = +formFieldValue.substring(0, formFieldValue.indexOf("/"))
      const year = +formFieldValue.substring(formFieldValue.indexOf("/") + 1)
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      if (year > 2032 || month > 12 || month < 1) {
        return Validator.errorPrefix + validationObj.errorMessages.dataMsgRegex
      }
      if (year < currentYear || (year === currentYear && month < currentMonth + 1)) {
        return Validator.errorPrefix + validationObj.errorMessages.dataMsgMonthYear
      } else {
        return ""
      }
    } else {
      return ""
    }
  }

  static validatePasswordMatch(target, validationObj, parentRef) {
    const form = parentRef.state.form;
    const sibling = Helper.search(validationObj.siblingField, parentRef);
    if (sibling && sibling.isDirty) {
      form.passwordsDifferent = target.value !== sibling.value;
      parentRef.setState({form});
    }
  }

  static validateState () {
    const form = {...this.state.form};
    let hasError = false;
    Object.keys(form.inputData).forEach(key => {
      const obj = {...form.inputData[key]};
      form.inputData[key] = obj;
      if (obj && obj.required && !obj.value) {
        if (key === "companyName" && this.props.userProfile && this.props.userProfile.type === "Internal") {
          return;
        }
        obj.error = obj.invalidError;
        hasError = true;
      } else {
        obj.error = "";
      }
    });
    this.setState({form});
    return hasError;
  }

  static validateForm (props, formMeta, toIgnoreKeys, isPreLoadValidatoin) {
    let error = false
    const formErrorsClone = Object.assign({}, props.formErrors)
    const formValues = props.formValues
    formErrorsClone &&
    Object.keys(formErrorsClone).map((key) => {
      if (
        toIgnoreKeys &&
        formMeta[key] !== undefined &&
        toIgnoreKeys.indexOf(formMeta[key]["id"]) === -1
      ) {
        if (formErrorsClone[key] !== "") {
          error = true
        }
      }
    })
    formValues && Object.keys(formValues).map((key) => {
      const validation = formMeta[key] && formMeta[key].validation
      const fieldValue = formValues[key]
      if (validation && validation.required && validation.required.isRequired) {
        if (
          toIgnoreKeys &&
          formMeta[key] !== undefined &&
          toIgnoreKeys.indexOf(formMeta[key]["id"]) === -1
        ) {
          if (fieldValue === "") {
            formErrorsClone[key] = validation.required.error_message
            error = true
          } else {
            if (formErrorsClone[key] === validation.required.error_message) {
              formErrorsClone[key] = ""
            }
          }
        }
      }
    })
    props.updateFormErrors({
      formErrors: {...formErrorsClone}
    })
    return error
  }

  // =============================== Backend Validations ====================================
  static checkBrandUniqueness(params) {
    if (!this.state.form.inputData.brandName.value) return;
    const state = {...this.state};
    const form = {...state.form};
    const inputData = {...form.inputData};
    state.form = form;
    form.inputData = inputData;
    inputData.brandName.loader = true;
    inputData.brandName.disabled = true;
    this.setState(state);
    Http.get("/api/brands/checkUnique", params)
      .then(res => {
        const error = res.body.unique ? "" : "This brand is already registered in your Walmart Brand Portal account";
        inputData.brandName.isUnique = res.body.unique;
        inputData.brandName.error = error;
        inputData.brandName.fieldOk = !error;
        inputData.brandName.disabled = false;
        inputData.brandName.loader = false;
        console.log("making brand api call ", inputData)
        this.setState(state, this.checkToEnableSubmit);
      })
      .catch(err => console.log(err));
  }

  static checkTrademarkValidity () {
    if (!this.state.form.inputData.trademarkNumber.value) return;
    const state = {...this.state};
    const form = {...state.form};
    const inputData = {...form.inputData};
    state.form = form;
    form.inputData = inputData;
    inputData.trademarkNumber.loader = true;
    inputData.trademarkNumber.disabled = true;
    inputData.trademarkNumber.fieldOk = false;
    this.setState(state);
    Http.get(`/api/brand/trademark/validity/${this.state.form.inputData.trademarkNumber.value}`)
      .then (res => {
        const error = res.body.valid ? "" : `${res.body.ipNumber} is already registered with a Walmart Brand Portal account. For more information please contact ipinvest@walmart.com`;
        inputData.trademarkNumber.isValid = res.body.valid;
        inputData.trademarkNumber.error = error;
        inputData.trademarkNumber.fieldOk = !error;
        inputData.trademarkNumber.disabled = false;
        inputData.trademarkNumber.loader = false;
        console.log("making trademark api call ", inputData)
        this.setState(state, this.checkToEnableSubmit);
      })
      .catch (err => console.log(err));
  }

  static checkCompanyNameAvailability () {
    if (!this.state.form.inputData.companyName.value) return;
    const state = {...this.state};
    const form = {...this.state.form};
    const inputData = {...this.state.form.inputData};
    state.form = form;
    form.inputData = inputData;
    inputData.companyName.disabled = true;
    inputData.companyName.loader = true;
    inputData.companyOnboardingActions.buttons = {...inputData.companyOnboardingActions.buttons}
    inputData.companyOnboardingActions.buttons.clear.disabled = true;
    this.setState(state);
    // const response = (await Http.get("/api/company/availability", {name: this.state.form.inputData.companyName.value}));
    Http.get("/api/company/availability", {name: this.state.form.inputData.companyName.value})
      .then(response => {
        const error = response.body.unique ? "" : `"${response.body.name}" already has a Walmart Brand Portal account. For more information please contact ipinvest@walmart.com.`;
        inputData.companyName.disabled = false;
        inputData.companyName.error = error;
        inputData.companyName.isUnique = !error;
        inputData.companyName.fieldOk = !error;
        inputData.companyName.loader = false;
        inputData.companyOnboardingActions.buttons.clear.disabled = false;
        this.setState(state, () => {
          this.toggleFormEnable(!error, !error, false)
          this.checkToEnableSubmit();
        });
      }).catch (err => {
        inputData.companyName.disabled = false;
        inputData.companyName.error = err.error;
        inputData.companyName.isUnique = false;
        inputData.companyName.fieldOk = false;
        inputData.companyName.loader = false;
        inputData.companyName.requestAdministratorAccess = true;
        inputData.companyOnboardingActions.buttons.clear.disabled = false;
        if (error) {
          this.props.showNotification(NOTIFICATION_TYPE.ERROR, "Uniqueness Check Failed, please try again!");
        }
        this.setState(state);
        // console.log(err);
      })
  }

  static onEmailChange() {
    const form = {...this.state.form};
    const inputData = {...this.state.form.inputData};
    const emailId = inputData.emailId;
    if (!emailId.value || emailId.error) return;
    form.inputData = inputData;
    emailId.disabled = true;
    emailId.loader = true;
    this.setState({form});
    if (emailId.value && emailId.error !== emailId.invalidError) {
      this.loader("fieldLoader", true);
      Http.get("/api/users/checkUnique", {email: emailId.value}).then(res => {
        emailId.disabled = false;
        emailId.loader = false;
        let error;
        let isUnique;
        error = !res.body.unique ? "This email already exists in the Walmart Brand Portal." : "";
        emailId.value = emailId.value ? emailId.value.toLowerCase() : emailId.value;
        emailId.error = emailId.error !== emailId.invalidError && error;
        emailId.isUnique = res.body.unique;
        emailId.fieldOk = !error;
        this.setState({form}, this.checkToEnableSubmit);
      }).catch(err => {
        emailId.disabled = false;
        emailId.loader = false;
        emailId.fieldOk = false;
        this.setState({form});
      });
    }
  }

  static onInvalid (evt, key) {
    const form = this.state.form;
    const matchedField = Object.keys(form.inputData).find(idKey => idKey === key);
    if (matchedField) {
      const matchedObj = form.inputData[matchedField];
      matchedObj.error = matchedObj.invalidError ? matchedObj.invalidError : Helper.search(matchedObj.invalidErrorPath);
      this.invalid[key] = true;
      this.setState({form});
    }
  }
}