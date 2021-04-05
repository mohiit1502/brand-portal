import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import $ from "jquery";
import {dispatchCompanyState} from "../../../actions/company/company-actions";
import {showNotification} from "../../../actions/notification/notification-actions";
import CONSTANTS from "../../../constants/constants";
import Helper from "../../../utility/helper";
import Validator from "../../../utility/validationUtil";
import ContentRenderer from "../../../utility/ContentRenderer";
import DocumentActions from "../../../utility/docOps";
import "../../../styles/onboard/content-renderer-onboarding/company-profile-registration.scss";
import mixpanel from "../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../constants/MixPanelConsants";

class CompanyProfileRegistration extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "resetCompanyRegistration", "gotoBrandRegistration", "cancelRequestCompanyAccess", "undertakingToggle"];
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    const debounceFunctions = {"companyDebounce": "checkCompanyNameAvailability"};
    functions.forEach(name => this[name] = this[name].bind(this));
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.displayProgressAndUpload = DocumentActions.displayProgressAndUpload.bind(this);
    this.cancelSelection = DocumentActions.cancelSelection.bind(this);
    // this.uploadAdditionalDocument = DocumentActions.displayProgressAndUpload.bind(this, "additionalDoc");
    this.onInvalid = Validator.onInvalid.bind(this);
    this.invalid = {zip: false};
    const companyConfiguration = this.props.companyContent ? this.props.companyContent : {}

    this.state = this.props.companyState && Object.keys(this.props.companyState).length > 0 ? this.props.companyState : {
      redirectToBrands: false,
      section: {...companyConfiguration.sectionConfig},
      form: {
        ...companyConfiguration.formConfig,
        inputData: {...companyConfiguration.fields}
      }
    };
  }

  componentDidMount() {
    const mixpanelPayload = {
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    $("[data-toggle='tooltip']").tooltip();
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.CREATE_COMPANY_PROFILE, mixpanelPayload);
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
      !form.inputData.companyName.error &&
      !form.inputData.zip.error;
    form.isSubmitDisabled = !bool;
    form.inputData.companyOnboardingActions.buttons = {...form.inputData.companyOnboardingActions.buttons}
    form.inputData.companyOnboardingActions.buttons.submit.disabled = !bool;
    form.inputData.additionalDoc.disabled = !bool;
    form.inputData.businessRegistrationDoc.disabled = !bool;
    if (form.inputData.businessRegistrationDoc.uploading || form.inputData.additionalDoc.uploading) {
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
      evt.target.pattern && evt.target.checkValidity();
      this.setState(state => {
        state = {...state};
        if (key === "companyName") {
          // state.form.inputData[key].isUnique = false;
          evt.persist();
          state.form.inputData.companyName.fieldOk = false;
          state.form.isSubmitDisabled = true;
          state.form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons}
          state.form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
          state.form.inputData.additionalDoc.disabled = true;
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

  toggleFormEnable(enable, isUnique) {
    const form = {...this.state.form};
    form.inputData.companyName.isUnique = isUnique;
    form.inputData.companyName.error = !enable ? form.inputData.companyName.error : "";
    form.inputData.address.disabled = !enable;
    form.inputData.city.disabled = !enable;
    form.inputData.state.disabled = !enable;
    form.inputData.zip.disabled = !enable;
    form.requestAdministratorAccess = !form.inputData.companyName.isUnique;
    this.setState({form});
  }

  cancelRequestCompanyAccess () {
    this.setState(state => {
      state = {...state};
      state.form.requestAdministratorAccess = false;
      return state;
    })
  }

  resetCompanyRegistration () {
    const state = {...this.state};
    const form = state.form = {...state.form};
    const inputKeys = ["companyName", "address", "city", "state", "zip"];
    const docKeys = ["businessRegistrationDoc", "additionalDoc"];
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
    form.inputData.companyOnboardingActions.buttons = {...state.form.inputData.companyOnboardingActions.buttons}
    form.inputData.companyOnboardingActions.buttons.submit.disabled = true;
    form.inputData.additionalDoc.disabled = true;
    form.inputData.businessRegistrationDoc.disabled = true;
    this.setState(state);
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.CANCLE_ONBOARDING_FORM );
  }

  gotoBrandRegistration (evt) {
    evt.preventDefault();
    const org = {
      name: this.state.form.inputData.companyName.value,
      address: this.state.form.inputData.address.value,
      city: this.state.form.inputData.city.value,
      state: this.state.form.inputData.state.value,
      zip: this.state.form.inputData.zip.value,
      countryCode: this.state.form.inputData.country.value,
      businessRegistrationDocId: this.state.form.inputData.businessRegistrationDoc.id
    };
    if (this.state.form.inputData.additionalDoc.id) {
      org.additionalDocId = this.state.form.inputData.additionalDoc.id;
    }
    this.props.updateOrgData(org, "company");
    this.setState({redirectToBrands: true});
    this.props.dispatchCompanyState(this.state);
  }

  render() {
    if (this.state.redirectToBrands) {
      return <Redirect to={CONSTANTS.ROUTES.ONBOARD.BRAND_REGISTER}/>;
    }
    const section = this.state.section;
    return (
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-8 col-12 pl-5 pr-0">
          <div className="row title-row mb-4 pl-4">
            <div className="col">
              <div className="company-registration-title">
                {section.sectionTitle}
              </div>
              <div className="company-registration-subtitle">
                {section.sectionSubTitle}
              </div>
            </div>
          </div>
          <form className="company-reg-form mb-4 pl-4" onSubmit={this.gotoBrandRegistration}>
            { this.getFieldRenders()}
            {/*  // TODO CODE: USERAPPROVAL - Uncomment below line once user approval flow is in progress*/}
          </form>
        </div>
      </div>
    );
  }
}

CompanyProfileRegistration.propTypes = {
  companyState: PropTypes.object,
  dispatchCompanyState: PropTypes.func,
  showNotification: PropTypes.func,
  updateOrgData: PropTypes.func,
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    companyContent: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.COMPANYREG,
    companyState: state.company && state.company.companyState,
  };
};

const mapDispatchToProps = {
  dispatchCompanyState,
  showNotification
};


export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfileRegistration);
