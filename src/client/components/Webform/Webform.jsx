/* eslint-disable max-statements */
/* eslint-disable filenames/match-regex */
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import "./Webform.component.scss";
import Helper from "../../utility/helper";
import Validator from "../../utility/validationUtil";
import CONSTANTS from "../../constants/constants";
import InputFormatter from "../../utility/phoneOps";
import {dispatchMetadata} from "../../actions/content/content-actions";
import {showNotification} from "../../actions/notification/notification-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import Http from "../../utility/Http";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import FORMFIELDCONFIG from "../../config/formsConfig/form-field-meta";

class Webform extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["checkToEnableItemButton", "disableSubmitButton", "enableSubmitButton", "onChange", "loader", "setSelectInputValue", "undertakingtoggle", "getClaimTypes", "checkToEnableSubmit", "customChangeHandler", "getItemListFromChild", "bubbleValue", "handleSubmit", "validateUrlItems"];
    functions.forEach(name => this[name] = this[name].bind(this));

    const debounceFunctions = {emailDebounce: "onEmailChange"};
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {emailId: false, phone: false};
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.validateState = Validator.validateState.bind(this);
    //this.itemUrlDebounce = Helper.debounce(this.onItemUrlChange, CONSTANTS.APIDEBOUNCETIMEOUT);
    this.trimSpaces = Helper.trimSpaces.bind(this);
    this.state = {
      loader: false,
      formError: ""
    };
  }

  componentDidMount() {
    this.updateStateAndFormatters(FORMFIELDCONFIG)
    Http.get("/api/formConfig")
      .then(response => {
        if (response.body) {
          try {
            response = JSON.parse(response.body);
            //response = FORMFIELDCONFIG;
            this.updateStateAndFormatters(response);
          } catch (e) {
            this.props.dispatchMetadata(FORMFIELDCONFIG);
            console.log(e);
          }
        }
      });
    const mixpanelPayload = {WORK_FLOW: "WEB_FORM"};
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.WEBFORM.VIEW_WEB_FORM, mixpanelPayload);
  }

  updateStateAndFormatters(root) {
    try {
      const fields = {};
      const webformFieldsConfiguration = root && root.SECTIONSCONFIG && root.SECTIONSCONFIG.WEBFORM ? root.SECTIONSCONFIG.WEBFORM : {};
      webformFieldsConfiguration && webformFieldsConfiguration.fields && Object.keys(webformFieldsConfiguration.fields)
        .forEach(field => fields[field] = {...webformFieldsConfiguration.fields[field]});
      this.setState(() => {
        const state = {...this.state};
        state.section = {...webformFieldsConfiguration.sectionConfig};
        state.form = {
          ...webformFieldsConfiguration.formConfig,
          inputData: {...fields}
        }
        const options = this.getClaimTypes();
        // const formatter = new InputFormatter();
        // const handlers = formatter.on(`#${state.section.id}-${state.form.inputData.phone.inputId}-custom-input`);
        // this.prebounceChangeHandler = handlers.inputHandler;
        state.form.inputData.claimType.claimTypesWithMeta = options;
        state.form.inputData.claimType.dropdownOptions = options && options.map(v => ({value: v.label}));
        return state;
      });
      this.props.dispatchMetadata(root);
    } catch (e) {
      console.error(e);
    }
  }

  getClaimTypes() {
    return [
      {
        claimType: "trademark",
        label: "Trademark",
        claimTypeIdentifierLabel: "Trademark Number",
        companyNameIdentifierLabel: "Trademark Company Name",
        ownerNameIdentifierLabel: "Trademark Owner Name",
        underTakingOwnerLabel: "trademark owner"
      },
      {
        claimType: "patent",
        label: "Patent",
        claimTypeIdentifierLabel: "Patent Number",
        companyNameIdentifierLabel: "Patent Company Name",
        ownerNameIdentifierLabel: "Patent Owner Name",
        underTakingOwnerLabel: "patent owner"
      },
      {
        claimType: "counterfeit",
        label: "Counterfeit",
        claimTypeIdentifierLabel: "Trademark Number",
        companyNameIdentifierLabel: "Rights Owner Company Name",
        ownerNameIdentifierLabel: "Rights Owner Name",
        underTakingOwnerLabel: "intellectual property owner"
      },
      {
        claimType: "copyright",
        label: "Copyright",
        claimTypeIdentifierLabel: "Copyright Number",
        companyNameIdentifierLabel: "Copyright Company Name",
        ownerNameIdentifierLabel: "Copyright Owner Name",
        underTakingOwnerLabel: "copyright owner"
      }
    ];
  }

  getItemListFromChild(itemList) {
    this.setState(state => {
      state = {...state};
      state.form.inputData.urlItems.itemList = [...itemList];
      return {
        ...state
      };
    }, this.checkToEnableItemButton);
  }

  bubbleValue(evt, key, error) {
    const targetVal = evt.target.value;
    let index = -1;
    if (key.split("-")[0] === "url" || key.split("-")[0] === "sellerName" && key.split("-")[1]) {
      index = Number(key.split("-")[1]);
      key = key.split("-")[0];
    }
    this.setState(state => {
      state = {...state};
      if (index > -1) {
        state.form.inputData.urlItems.itemList[index][key].value = targetVal;
        state.form.inputData.urlItems.itemList[index][key].error = error;
        state.form.inputData.urlItems.disableAddItem = true;
      } else {
        state.form.inputData[key].value = targetVal;
        state.form.inputData[key].error = error;
      }
      return {
        ...state
      };
    }, this.checkToEnableItemButton);
  }

  validateUrlItems = () => {
    const form = {...this.state.form};
    let hasError = false;
    form.inputData.urlItems.itemList.forEach(item => {
      if (!item.url.value) {
        hasError = true;
        item.url.error = (item.url.validators && item.url.validators.validateRequired && item.url.validators.validateRequired.error) || item.invalidError || "Please Enter Valid Input";
      }
      if (!item.sellerName.value) {
        hasError = true;
        item.sellerName.error = (item.sellerName.validators && item.sellerName.validators.validateRequired && item.sellerName.validators.validateRequired.error) || item.invalidError || "Please Enter Valid Input";
      }
    });
    this.setState({form});
    return hasError;
  };

  onChange(evt, key) {
    evt.persist && evt.persist();
    if (evt && evt.target) {
      this.invalid[key] = false;
      evt.target.checkValidity && evt.target.checkValidity();
      const targetVal = evt.target.value;
      let index = -1;
      if (key.split("-")[0] === "url" || key.split("-")[0] === "sellerName" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }

      this.setState(state => {
        state = {...state};
        if (index > -1) {
          if (key.split("-")[0] === "url") {
            state.form.inputData.urlItems.itemList[index][key].error = "";
            state.form.inputData.urlItems.itemList[index].sellerName.disabled = false;
            state.form.inputData.urlItems.itemList[index][key].value = targetVal;
            state.form.inputData.urlItems.disableAddItem = true;
          } else {
            state.form.inputData.urlItems.itemList[index][key].value = targetVal;
            state.form.inputData.urlItems.itemList[index][key].error = "";
            //state.form.inputData.urlItems.itemList[index].url.error = "";
            state.form.inputData.urlItems.disableAddItem = false;
          }
        } else {
          state.form.inputData[key].error = !this.invalid[key] ? "" : state.form.inputData[key].error;
          state.form.inputData[key].value = targetVal;
        }
        return {
          ...state
        };
      }, this.checkToEnableItemButton);
    }
  }

  customChangeHandler(value) {
    const form = this.state.form;
    const claimTypesWithMeta = form.inputData.claimType.claimTypesWithMeta;
    const matchedClaimTypeWithMeta = claimTypesWithMeta.find(claimTypeWithMeta => claimTypeWithMeta.label === value);
    if (matchedClaimTypeWithMeta) {
      form.inputData.companyName.label = matchedClaimTypeWithMeta.companyNameIdentifierLabel;
      form.inputData.ownerName.label = matchedClaimTypeWithMeta.ownerNameIdentifierLabel;
      form.claimTypeSelected = true;
      form.inputData.user_undertaking_1.label = form.inputData.user_undertaking_1.originalLabel.replace("__owner_label__", matchedClaimTypeWithMeta.underTakingOwnerLabel);
      if (matchedClaimTypeWithMeta.claimType !== "copyright") {
        form.inputData.user_undertaking_3.required = false;
      } else {
        form.inputData.user_undertaking_3.required = true;
      }
      this.setState({form});
    }
  }

  setSelectInputValue(value, key) {
    if (value) {
      let index = -1;
      if (key.split("-")[0] === "sellerName" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = value;
        return {
          ...state
        };
      }, this.checkToEnableItemButton);
    }
  }

  // eslint-disable-next-line complexity
  checkToEnableSubmit(callback) {
    const form = {...this.state.form};
    const userUndetaking = form.inputData.user_undertaking_1.selected && form.inputData.user_undertaking_2.selected && (form.inputData.claimType.value !== "Copyright" || form.inputData.user_undertaking_3.selected) && form.inputData.user_undertaking_4.selected && form.inputData.user_undertaking_5.selected;
    const isValidItemList = form.inputData.urlItems.itemList.reduce((boolResult, item) => !!(boolResult && item.url.value && !item.url.error && item.sellerName.value && item.sellerName.value.length > 0 && !item.sellerName.error), true);
    const isHuman = (!form.inputData.captchaValidator) || (form.inputData.captchaValidator.value);
    const bool = isValidItemList && userUndetaking && isHuman && form.inputData.claimType.value &&
      form.inputData.firstName.value && form.inputData.lastName.value &&
      form.inputData.ownerName.value && form.inputData.companyName.value &&
      form.inputData.brandName.value &&
      form.inputData.address_1.value && form.inputData.address_2.value &&
      form.inputData.city.value && form.inputData.country.value &&
      form.inputData.state.value && form.inputData.zip.value && !form.inputData.zip.error &&
      form.inputData.phone.value && !form.inputData.phone.error && form.inputData.emailId.value && !form.inputData.emailId.error &&
      form.inputData.comments.value && !form.inputData.comments.error &&
      form.inputData.digitalSignature.value;

    form.isSubmitDisabled = !bool;
    form.inputData.webFormActions.buttons.submit.disabled = !bool;
    this.setState({form}, callback && callback());
  }

  checkToEnableItemButton() {
    const state = {...this.state};
    let shouldDisable = false;
    state.form.inputData.urlItems.itemList.every(item => {
      if (!item.url.value || !item.sellerName.value || (item.sellerName.value.length !== undefined && item.sellerName.value.length === 0) || item.url.error || item.sellerName.error) {
        shouldDisable = true;
        return false;
      }
      return true;
    });
    state.form.inputData.urlItems.disableAddItem = shouldDisable;
    this.setState(state);
  }

  undertakingtoggle(evt, undertaking, index) {
    const state = {...this.state};
    state.form.inputData[evt.target.id].selected = !state.form.inputData[evt.target.id].selected;
    state.form.inputData[evt.target.id].error = state.form.inputData[evt.target.id].selected ? "" : state.form.inputData[evt.target.id].error;
    this.setState({
      ...state
    });
  }

  mixpanelBatchEventUtil(eventName, payload) {
    const items = payload.items;
    const mixpanelPayload = items && items.map(item => {
      const eventPayload = {};
      eventPayload.SELLER_NAME = item.sellerName;
      eventPayload.ITEM_URL = item.itemUrl;
      eventPayload.CLAIM_TYPE = payload.claimType;
      eventPayload.BRAND_NAME = payload.brandInfo.brandName;
      eventPayload.COMPANY_NAME = payload.brandInfo.companyName;
      eventPayload.OWNER_NAME = payload.brandInfo.companyName;
      eventPayload.$email = payload.reporterInfo.email;
      eventPayload.$user_id = payload.reporterInfo.email;
      eventPayload.WORK_FLOW = "WEB_FORM";
      return eventPayload;
    });
    mixpanel.trackEventBatch(eventName, mixpanelPayload);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if (!this.validateState()) {
      this.disableSubmitButton();
      this.setState({
        formError: "",
        loader: true
      });
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.WEBFORM.SUBMIT_WEBFORM_CLICKED, {WORK_FLOW: "WEB_FORM"});

      const inputData = this.state.form.inputData;
      const claimType = inputData.claimType.value;
      // "metaInfo": {
      //   "userAgent": "",
      //   "clientIp": ""
      // },
      const reporterInfo = {
        firstName: inputData.firstName.value,
        lastName: inputData.lastName.value,
        phoneNumber: inputData.phone.value,
        email: inputData.emailId.value,
        legalAddress: {
          address1: inputData.address_1.value,
          address2: inputData.address_2.value,
          city: inputData.city.value,
          country: inputData.country.value,
          state: inputData.state.value,
          zip: inputData.zip.value
        }
      };
      const brandInfo = {
        brandName: inputData.brandName.value,
        ownerName: inputData.ownerName.value,
        companyName: inputData.companyName.value
      };
      const comments = inputData.comments.value;
      const digitalSignatureBy = inputData.digitalSignature.value;

      const getItems = items => {
        const itemList = [];
        items.forEach(item => {
          const itemUrl = item.url.value.trim();
          const sellerNames = item.sellerName.value.trim();
          itemList.push({itemUrl, sellerName: sellerNames});
        });
        return itemList;
      };
      const payload = {
        claimType,
        reporterInfo,
        brandInfo,
        comments,
        digitalSignatureBy,
        items: getItems(inputData.urlItems.itemList)
      };
      const mixpanelPayload = {
        API: "/api/claims/webform",
        BRAND_INFO: brandInfo,
        WORK_FLOW: "WEB_FORM",
        $email: reporterInfo.email,
        $user_id: reporterInfo.email,
        $name: `${reporterInfo.firstName} ${reporterInfo.lastName}`,
        ITEMS: getItems(inputData.urlItems.itemList),
        CLAIM_TYPE: claimType,
        BRAND_NAME: brandInfo.brandName,
        COMPANY_NAME: brandInfo.companyName,
        OWNER_NAME: brandInfo.companyName
      };

      this.loader("loader", true);
      Http.post("/api/claims/webform", payload, null, null, this.props.showNotification, "Claim submitted successfully", "Something went wrong, please try again..!")
        .then(res => {
          this.props.dispatchWebformState(CONSTANTS.WEBFORM.CTA);
          mixpanelPayload.API_SUCCESS = true;
          this.loader("loader", false);
          this.mixpanelBatchEventUtil(MIXPANEL_CONSTANTS.WEBFORM.SUBMITTED_CLAIM_DEATILS, payload);
        })
        .catch(err => {
          this.loader("loader", false);
          mixpanelPayload.API_SUCCESS = false;
          mixpanelPayload.ERROR = err.message ? err.message : err;
          console.log(err);
        }).finally(e => {
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.WEBFORM.SUBMIT_WEBFORM, mixpanelPayload);
      });
    } else {
      this.setState({
        formError: this.state.form.formError
      });
    }
  }

  disableSubmitButton() {
    this.setState(state => {
      state = {...state};
      state.form.isSubmitDisabled = true;
      return state;
    });
  }

  enableSubmitButton() {
    this.setState(state => {
      state = {...state};
      state.form.isSubmitDisabled = false;
      return state;
    });
  }

  loader(type, enable) {
    this.setState(state => {
      const stateClone = {...state};
      if (type === "fieldLoader") {
        stateClone.form.inputData.urlItems.fieldLoader = enable;
      } else {
        stateClone[type] = enable;
      }
      return stateClone;
    });
  }

  render() {
    const config = this.props.configuration;
    return (
      <div className={`c-Webform mt-4rem d-flex justify-content-center ${this.state.loader ? " loader" : ""}`}>
        <div className="col-lg-8 col-md-6 col-6 pl-3 pr-3">
          {config
          && <div>
            {config.header && config.header.text &&
            <p className={config.header.classes ? " " + config.header.classes : ""}>{config.header.text}</p>}
            {config.subText && config.subText.text &&
            <p className={config.subText.classes ? " " + config.subText.classes : ""}>{config.subText.text}</p>}
            {config.disclaimer && <p className={config.disclaimer.classes ? " " + config.disclaimer.classes : ""}
                                     onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.SHOW,
                                       {
                                         templateName: "StatusModalTemplate",
                                         MESSAGE: config.disclaimer.modalDisclaimerText,
                                         HEADER: config.disclaimer.modalHeaderText,
                                         TYPE: "NON_STATUS",
                                         BUTTON_TEXT: config.disclaimer.actionBtnText
                                       })}>
              {config.disclaimer.btnText}
            </p>}
          </div>
          }
          {
            this.state.formError &&
            <small className={`form-text custom-input-help-text form-error`}>
              {this.state.formError}
            </small>
          }
          <div className="web-form mb-4 mr-3">
            {this.getFieldRenders()}
          </div>
        </div>
      </div>
    );
  }

}

Webform.propTypes = {
  configuration: PropTypes.object,
  dispatchMetadata: PropTypes.func,
  dispatchWebformState: PropTypes.func,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  webformFieldsConfiguration: PropTypes.object
};

const mapDispatchToProps = {
  dispatchMetadata,
  showNotification,
  toggleModal
};

export default connect(null, mapDispatchToProps)(Webform);
