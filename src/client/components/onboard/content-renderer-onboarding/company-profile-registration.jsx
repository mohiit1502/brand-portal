import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import Cookies from "electrode-cookies";
import $ from "jquery";
import {dispatchCompanyState} from "../../../actions/company/company-actions";
import {toggleModal, TOGGLE_ACTIONS} from "../../../actions/modal-actions";
import {showNotification} from "../../../actions/notification/notification-actions";
import CONSTANTS from "../../../constants/constants";
import Helper from "../../../utility/helper";
import Validator from "../../../utility/validationUtil";
import ContentRenderer from "../../../utility/ContentRenderer";
import DocumentActions from "../../../utility/docOps";
import "../../../styles/onboard/content-renderer-onboarding/company-profile-registration.scss";
import mixpanel from "../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";

class CompanyProfileRegistration extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "cancelRequestCompanyAccess", "gotoBrandRegistration", "onChange", "resetCompanyRegistration", "setSelectInputValue", "undertakingToggle"];
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    const debounceFunctions = {companyDebounce: "checkCompanyNameAvailability"};
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.displayProgressAndUpload = DocumentActions.displayProgressAndUpload.bind(this);
    this.cancelSelection = DocumentActions.cancelSelection.bind(this);
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {zip: false};
    const companyConfiguration = this.props.companyContent ? this.props.companyContent : {};

    this.state = this.props.companyState && Object.keys(this.props.companyState).length > 0 ? this.props.companyState : {
      redirectToBrands: false,
      section: {...companyConfiguration.sectionConfig},
      clientType: Cookies.get("client_type"),
      form: {
        ...companyConfiguration.formConfig,
        inputData: {...companyConfiguration.fields},
        formPopulated: false
      }
    };

    this.enableSellerOnboarding();
  }

  componentDidMount() {
    const mixpanelPayload = {
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    $("[data-toggle='tooltip']").tooltip();
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.CREATE_COMPANY_PROFILE, mixpanelPayload);
    if (this.props.profile && !this.state.form.formPopulated && this.state.clientType && this.state.clientType === "seller") {
      this.prepopulateInputFields(this.props.profile);
    }

    if (this.state.clientType === "supplier") {
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...this.props.modalsMeta.EMAIL_VERIFIED});
    }else {
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...this.props.modalsMeta.SELLER_WELCOME_PROMPT});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile && this.props.profile !== prevProps.profile && !this.state.form.formPopulated && this.state.clientType && this.state.clientType === "seller") {
      this.prepopulateInputFields(this.props.profile);
    }
  }

  /* eslint-disable react/no-direct-mutation-state */
  enableSellerOnboarding () {
    // TODO: Change to add 100 sellers [This is temporary and should be removed once the sellers are added]
    if (this.state.form && this.props.profile && this.state.clientType === "seller" && !this.state.countryInitialized
      && this.state.form.internationalSellerExceptions && this.state.form.internationalSellerExceptions.indexOf(this.props.profile.email) > -1) {
      const countryField = this.state.form.inputData.country;
      const zipField = this.state.form.inputData.zip;
      countryField.dropdownOptions = [
        {id: "usa", value: "USA", label: "USA"},
        {id: "china", value: "China", label: "China"},
        {id: "hongkong", value: "Hong Kong", label: "Hong Kong"}
      ];
      countryField.onChange = "setSelectInputValue";
      countryField.type = "select";
      countryField.value = "";
      delete zipField.patternPath;
      delete zipField.invalidErrorPath;
      delete zipField.invalidError;
      zipField.patternErrorMessage = "This field is required";
      zipField.maxLength = 30;
      this.state.considerCountryForValidation = true;
      this.state.countryInitialized = true;
    }
  }

  prepopulateInputFields (data) {
    const form = {...this.state.form};
    const seller = data.sellerInfo;
    if (seller && seller.taxClassification === "W9") {
      const concatAddressFields = ["address1", "address2", "address3", "address4"];
      const organizationAddress = seller.organizationAddress;
      form.inputData.companyName.value = seller.legalName;
      form.inputData.address.value = organizationAddress ? Object.keys(organizationAddress).filter(key => concatAddressFields.indexOf(key) > -1).map(key => organizationAddress[key]).filter(key => key).join(", ") : "";
      form.inputData.city.value = organizationAddress.city || "";
      form.inputData.state.value = organizationAddress.state || "";
      form.inputData.zip.value = organizationAddress.postalcode || "";
      form.inputData.country.value = organizationAddress.country || "US";
      form.formPopulated = true;

      form.isUpdateTemplate = true;
      this.setState({form}, () => this.companyDebounce());
    }
  }

  undertakingToggle () {
    const state = {...this.state};
    state.form.inputData.undertakingToggle.selected = !state.form.inputData.undertakingToggle.selected;
    state.form.inputData.companyRequestApprovalActions.buttons.submit.disabled = !state.form.inputData.undertakingToggle.selected;
    this.setState(state, this.checkToEnableSubmit);
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.companyName.value &&
      form.inputData.address.value &&
      form.inputData.city.value &&
      form.inputData.state.value &&
      form.inputData.zip.value &&
      (this.state.considerCountryForValidation ? form.inputData.country.value : true) &&
      !form.inputData.companyName.error &&
      !form.inputData.zip.error;
    form.isSubmitDisabled = !bool;
    form.inputData.companyOnboardingActions.buttons = {...form.inputData.companyOnboardingActions.buttons};
    form.inputData.companyOnboardingActions.buttons.submit.disabled = !bool;
    // form.inputData.additionalDoc.disabled = !bool;
    form.inputData.businessRegistrationDoc.disabled = !bool;
    if (form.inputData.businessRegistrationDoc.uploading) {
      form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
    }
    this.setState({form});
  }

  bubbleValue (evt, key, error) {
    const targetVal = evt.target.value;
    this.setState(state => {
      state = {...state};
      state.form.inputData[key].value = targetVal;
      state.form.inputData[key].error = error;
      return state;
    }, this.checkToEnableSubmit);
  }

  onChange (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      /* eslint-disable no-unused-expressions */
      evt.target.pattern && evt.target.checkValidity();
      this.setState(state => {
        state = {...state};
        if (key === "companyName") {
          evt.persist();
          state.form.inputData.companyName.fieldOk = false;
          state.form.isSubmitDisabled = true;
          state.form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons};
          state.form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
          // state.form.inputData.additionalDoc.disabled = true;
          state.form.inputData.businessRegistrationDoc.disabled = true;
          this.toggleFormEnable(false, false);
          this.companyDebounce(evt);
        }
        state.form.inputData[key].value = targetVal;
        state.form.inputData[key].error = !this.invalid[key] ? "" : state.form.inputData[key].error;
        this.invalid[key] = false;
        return state;
      }, key !== "companyName" ? this.checkToEnableSubmit : null);
    }
  }


  setSelectInputValue (value, key) {
    if (value) {
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = value;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  toggleFormEnable(enable, isUnique) {
    const form = {...this.state.form};
    form.inputData.companyName.isUnique = isUnique;
    form.inputData.companyName.error = !enable ? form.inputData.companyName.error : "";
    form.inputData.address.disabled = !enable;
    form.inputData.city.disabled = !enable;
    form.inputData.state.disabled = !enable;
    form.inputData.zip.disabled = !enable;
    form.inputData.country.disabled = this.state.considerCountryForValidation ? !enable : true;
    form.requestAdministratorAccess = !form.inputData.companyName.isUnique;
    this.setState({form});
  }

  cancelRequestCompanyAccess () {
    this.setState(state => {
      state = {...state};
      state.form.requestAdministratorAccess = false;
      return state;
    });
  }

  /* eslint-disable max-statements */
  resetCompanyRegistration () {
    const state = {...this.state};
    const form = state.form = {...state.form};
    const inputKeys = ["companyName", "address", "city", "state", "zip"];
    const docKeys = ["businessRegistrationDoc"];
    this.state.considerCountryForValidation && inputKeys.push("country");
    inputKeys.forEach(key => {
      form.inputData[key].disabled = true;
      form.inputData[key].error = "";
      form.inputData[key].value = "";
      form.inputData[key].fieldOk = false;
    });
    docKeys.forEach(key => {
      form.inputData[key].id = "";
      form.inputData[key].uploadPercentage = 0;
    });
    form.inputData.companyName.isUnique = true;
    form.inputData.companyName.disabled = false;
    form.requestAdministratorAccess = false;
    form.isSubmitDisabled = true;
    form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons};
    form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
    // form.inputData.additionalDoc.disabled = true;
    form.inputData.businessRegistrationDoc.disabled = true;
    this.setState(state);
    const mixpanelPayload = {
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.CANCLE_ONBOARDING_FORM, mixpanelPayload);
  }

  gotoBrandRegistration (evt) {
    evt.preventDefault();
    console.log(this.state.form.inputData);
    const org = {
      name: this.state.form.inputData.companyName.value,
      address: this.state.form.inputData.address.value,
      city: this.state.form.inputData.city.value,
      state: this.state.form.inputData.state.value,
      zip: this.state.form.inputData.zip.value,
      countryCode: this.state.form.inputData.country.value,
      businessRegistrationDocId: this.state.form.inputData.businessRegistrationDoc.id,
      businessRegistrationDocName: this.state.form.inputData.businessRegistrationDoc.name
    };
    // if (this.state.form.inputData.additionalDoc.id) {
    //   org.additionalDocId = this.state.form.inputData.additionalDoc.id;
    // }
    if (this.state.clientType === "seller") {
      org.sellerInfo = this.props.profile.sellerInfo;
    }
    this.props.updateOrgData(org, "company");
    this.setState({redirectToBrands: true});
    this.props.dispatchCompanyState(this.state);
  }

  render() {
    if (this.state.redirectToBrands) {
      return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.BRAND_REGISTER}/>;
    }
    const section = this.state.section;
    return (
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-8 col-12 pl-5 pr-0">
          <div className="row title-row mb-4 pl-4">
            <div className="col">
              <div className="company-registration-title">
                {this.state.clientType && this.state.clientType === "seller" ? section.sectionSellerTitle : section.sectionTitle}
              </div>
              <div className="company-registration-subtitle">
                {this.state.clientType && this.state.clientType === "seller" ? section.sectionSellerSubTitle : section.sectionSubTitle}
              </div>
            </div>
          </div>
          {/* eslint-disable react/jsx-handler-names */}
          <form className="company-reg-form mb-4 pl-4" onSubmit={this.gotoBrandRegistration}>
            { this.getFieldRenders()}
          </form>
        </div>
      </div>
    );
  }
}

CompanyProfileRegistration.propTypes = {
  companyContent: PropTypes.object,
  companyState: PropTypes.object,
  dispatchCompanyState: PropTypes.func,
  modal: PropTypes.object,
  profile: PropTypes.object,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  modalsMeta: PropTypes.object,
  updateOrgData: PropTypes.func
};

const mapStateToProps = state => {
  return {
    companyContent: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.COMPANYREG,
    companyState: state.company && state.company.companyState,
    profile: state.user && state.user.profile,
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {}

  };
};

const mapDispatchToProps = {
  dispatchCompanyState,
  showNotification,
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfileRegistration);
