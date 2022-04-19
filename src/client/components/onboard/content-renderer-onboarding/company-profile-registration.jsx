/* eslint-disable max-statements */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import Cookies from "electrode-cookies";
import $ from "jquery";
import {dispatchCompanyState, dispatchSteps, dispatchOnboardingDetails, dispatchOriginalValues} from "../../../actions/company/company-actions";
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
    const functions = ["enableSellerOnboarding", "evaluatePermissionAndValidations", "bubbleValue", "gotoBrandRegistration", "onChange", "setSelectInputValue", "updateValidationsForIntlUsers"];
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
      modalViewed: false,
      form: {
        ...companyConfiguration.formConfig,
        inputData: {...companyConfiguration.fields},
        formPopulated: false
      }
    };

    this.evaluatePermissionAndValidations();
    this.enableSellerOnboarding();
  }

  componentDidMount() {
    const mixpanelPayload = {
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    const tooltipComp = $("[data-toggle='tooltip']");
    tooltipComp.tooltip && tooltipComp.tooltip();
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.CREATE_COMPANY_PROFILE, mixpanelPayload);
    if (!this.state.form.formPopulated) {
      this.prepopulateInputFields();
    }

    if (!this.state.modalViewed && (this.props.profile && this.props.profile.context !== "edit")) {
      if (this.state.clientType === "supplier") {
        this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...this.props.modalsMeta.EMAIL_VERIFIED});
      } else {
        this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...this.props.modalsMeta.SELLER_WELCOME_PROMPT});
      }
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        modalViewed: true
      });
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
      this.updateValidationsForIntlUsers();
    }
  }

  updateValidationsForIntlUsers (state) {
    // const countryField = this.state.form.inputData.country;
    state = state ? state : this.state;
    const zipField = state.form.inputData.zip;
    // ----- Retaining below for later when intl. seller onboarding is resumed ----
    // countryField.dropdownOptions = [
    //   {id: "usa", value: "USA", label: "USA"},
    //   {id: "china", value: "China", label: "China"},
    //   {id: "hongkong", value: "Hong Kong", label: "Hong Kong"}
    // ];
    // countryField.onChange = "setSelectInputValue";
    // countryField.type = "select";
    // countryField.value = "";
    state.form.removeIntlSellerFields && state.form.removeIntlSellerFields.forEach(val => delete zipField[val])
    zipField.pattern = "^[\\d-]{5,}$";
    zipField.invalidError = "Please enter a valid zip code";
    zipField.patternErrorMessage = "Please enter a valid zip code";
    zipField.maxLength = 30;
    state.considerCountryForValidation = true;
    state.countryInitialized = true;
  }

  evaluatePermissionAndValidations() {
    if (this.state.clientType === "seller") {
      const form = this.state.form;
      const {
        taxClassification,
        organizationAddress: {country}
      } = this.props.profile && this.props.profile.sellerInfo ? this.props.profile.sellerInfo : {organizationAddress: {}};
      const DID_US_TAX_COUNTRY_MISMATCH = form.USTaxClassifications && form.USTaxClassifications.indexOf(taxClassification) > -1
        && form.allowedCountriesForDomesticTaxClassification && form.allowedCountriesForDomesticTaxClassification.indexOf(country) === -1;
      const DID_INTL_TAX_COUNTRY_MISMATCH = form.internationalTaxClassifications && form.internationalTaxClassifications.indexOf(taxClassification) > -1
        && form.allowedCountriesForIntlTaxClassification && form.allowedCountriesForIntlTaxClassification.indexOf(country) === -1;
      if (DID_US_TAX_COUNTRY_MISMATCH || DID_INTL_TAX_COUNTRY_MISMATCH) {
        form.isTaxCountryMismatched = true;
        form.inputData.country.error = form.inputData.country.taxCountryMismatchError;
      }
    }
  }

  prepopulateSellerInputFields(data) {
    const form = {...this.state.form};
    const seller = data.sellerInfo;
    // if (seller && seller.taxClassification === "W9") {
    if (seller) {
      const concatAddressFields = ["address1", "address2", "address3", "address4"];
      const organizationAddress = seller.organizationAddress;
      form.inputData.companyName.value = seller.legalName;
      form.inputData.address.value = organizationAddress ? Object.keys(organizationAddress).filter(key => concatAddressFields.indexOf(key) > -1).map(key => organizationAddress[key]).filter(key => key).join(", ") : "";
      form.inputData.city.value = organizationAddress.city || "";
      form.inputData.state.value = organizationAddress.state || "";
      form.inputData.zip.value = organizationAddress.postalcode || "";
      form.inputData.country.value = organizationAddress.country || "US";
      form.formPopulated = true;

      this.setState({form}, data.context === "edit" || !form.isTaxCountryMismatched ? () => this.companyDebounce() : () => {});
    }
  }

  prepopulateInputContextEdit() {
    if (this.props.onboardingDetails) {
      const data = this.props.onboardingDetails.org;
      const originalValues = JSON.parse(JSON.stringify(this.props.onboardingDetails));
      originalValues.brand && delete originalValues.brand.comments;
      const form = {...this.state.form};
      if (data) {
        // const isIntlCountry = ["US", "USA", "United States"].indexOf(data.countryCode) === -1;
        const isSeller = this.state.clientType === "seller";
        if (isSeller) {
          const stateClone = {...this.state};
          this.updateValidationsForIntlUsers(stateClone);
          this.setState(stateClone);
        }
        form.inputData.companyName.value = data.name;
        form.inputData.address.value = data.address;
        form.inputData.city.value = data.city || "";
        form.inputData.state.value = data.state || "";
        form.inputData.zip.value = data.zip || "";
        form.inputData.country.value = data.countryCode || "US";
        form.formPopulated = true;
        form.inputData.companyName.isUnique = true;
        this.props.dispatchOriginalValues({
          ...originalValues
        });
        this.setState({form}, () => {
          this.toggleFormEnable(true, true, false);
          this.checkToEnableSubmit();
        });
      }
    }
  }

  prepopulateInputFields () {
    const data = this.props.profile;
    if (this.props.profile.context !== "edit") {
      if (this.state.clientType && this.state.clientType === "seller") {
        this.prepopulateSellerInputFields(data);
      }
    } else {
      this.prepopulateInputContextEdit();
    }
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
      !form.inputData.zip.error &&
      (this.state.clientType !== "seller" || this.props.profile.context === "edit" || !form.isTaxCountryMismatched);
    form.isSubmitDisabled = !bool;
    form.inputData.companyOnboardingActions.buttons = {...form.inputData.companyOnboardingActions.buttons};
    form.inputData.companyOnboardingActions.buttons.submit.disabled = !bool;
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
        const isEditMode = this.props.userProfile && this.props.userProfile.context === "edit";
        if (key === "companyName") {
          if ((isEditMode && this.props.originalValues && this.props.originalValues.org && this.props.originalValues.org.name
            && targetVal && this.props.originalValues.org.name.trim() !== targetVal.trim()) || !isEditMode) {
            evt.persist();
            state.form.inputData.companyName.fieldOk = false;
            state.form.isSubmitDisabled = true;
            state.form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons};
            state.form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
            // state.form.inputData.additionalDoc.disabled = true;
            state.form.inputData.businessRegistrationDoc.disabled = true;
            this.toggleFormEnable(false, false);
          }
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

  gotoBrandRegistration (evt) {
    evt.preventDefault();
    let docNames = (this.props.onboardingDetails && this.props.onboardingDetails.org && this.props.onboardingDetails.org.businessRegistrationDocList) || [];
    const org = {
      name: this.state.form.inputData.companyName.value,
      address: this.state.form.inputData.address.value,
      city: this.state.form.inputData.city.value,
      state: this.state.form.inputData.state.value,
      zip: this.state.form.inputData.zip.value,
      countryCode: this.state.form.inputData.country.value,
    };

    const currentDocId = this.state.form.inputData.businessRegistrationDoc.id;
    docNames = docNames.filter(doc => doc.createTS);
      currentDocId && docNames.push({
        documentId: this.state.form.inputData.businessRegistrationDoc.id,
        documentName: this.state.form.inputData.businessRegistrationDoc.filename
      });
      if (docNames.length > 0) {
        org.businessRegistrationDocList = [...docNames];
      }
    if (this.state.clientType === "seller") {
      org.sellerInfo = this.props.profile.sellerInfo;
    }
    const steps = this.props.steps ? [...this.props.steps] : [];
    /* eslint-disable no-unused-expressions */
    if (steps) {
      steps[0].complete = true;
      steps[1].complete = true;
      steps[0].active = false;
      steps[1].active = true;
    }
    this.props.updateOrgData(org, "company");
    this.props.dispatchCompanyState(this.state);
    this.props.dispatchOnboardingDetails({
      ...this.props.onboardingDetails,
      org
    });
    this.props.dispatchSteps(steps);
    this.props.history.push("/onboard/brand");
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
              <div className="company-registration-subtitle mt-2">
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
  originalValues: PropTypes.object,
  profile: PropTypes.object,
  showNotification: PropTypes.func,
  toggleModal: PropTypes.func,
  modalsMeta: PropTypes.object,
  updateOrgData: PropTypes.func
};

const mapStateToProps = state => {
  return {
    companyContent: state.content && state.content.metadata && state.content.metadata.FORMSCONFIG && state.content.metadata.FORMSCONFIG.COMPANYREG,
    companyState: state.company && state.company.companyState,
    profile: state.user && state.user.profile,
    steps: state.company && state.company.steps,
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {},
    onboardingDetails: state.company && state.company.onboardingDetails,
    originalValues: state.company && state.company.originalValues
  };
};

const mapDispatchToProps = {
  dispatchCompanyState,
  dispatchOnboardingDetails,
  dispatchOriginalValues,
  dispatchSteps,
  showNotification,
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfileRegistration);
