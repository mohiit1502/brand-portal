import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {dispatchBrandState, dispatchNewRequest, dispatchSteps} from "../../../actions/company/company-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";
import {updateUserProfile} from "../../../actions/user/user-actions";
import {showNotification} from "../../../actions/notification/notification-actions";
import Http from "../../../utility/Http";
import Helper from "../../../utility/helper";
import CONSTANTS from "../../../constants/constants";
import Validator from "../../../utility/validationUtil";
import "./../../../styles/onboard/content-renderer-onboarding/brand-registration.scss";
import ContentRenderer from "../../../utility/ContentRenderer";
import mixpanel from "../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";

class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "gotoCompanyRegistration", "submitOnboardingForm", "undertakingtoggle"];
    const debounceFunctions = {brandDebounce: "checkBrandUniqueness", trademarkDebounce: "checkTrademarkValidity"};
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.loader = Helper.loader.bind(this);
    const brandConfiguration = this.props.brandContent ? this.props.brandContent : {};
    this.state = this.props.brandState && Object.keys(this.props.brandState).length > 0 ? this.props.brandState : {
      redirectToCompanyReg: !this.props.org,
      section: {...brandConfiguration.sectionConfig},
      form: {
        ...brandConfiguration.formConfig,
        inputData: {...brandConfiguration.fields}
      }
    };
    const mixpanelPayload = {
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.BRAND_REGISTRATION, mixpanelPayload);
  }

  checkToEnableSubmit () {
    const form = {...this.state.form};
    const bool = form.inputData.trademarkNumber.isValid &&
      form.inputData.trademarkNumber.value &&
      !form.inputData.trademarkNumber.error &&
      form.inputData.brandName.value &&
      form.inputData.brandName.isUnique &&
      !form.inputData.brandName.error &&
      form.inputData.undertaking.selected;
    form.inputData.brandOnboardingActions.buttons.submit.disabled = !bool;
    this.setState({form});
  }

  /* eslint-disable no-magic-numbers */
  onKeyPress(evt, key) {
    if (key === "trademarkNumber" && ((evt.which < 48 || evt.which > 57) && !CONSTANTS.ALLOWED_KEY_CODES.includes(evt.which))) {
      evt.preventDefault();
    }
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
      this.setState(state => {
        state = {...state};
        if (key === "trademarkNumber") {
          this.trademarkDebounce();
          state.form.inputData.trademarkNumber.fieldAlert = false;
          state.form.inputData.trademarkNumber.fieldOk = false;
          state.form.inputData.trademarkNumber.error = "";
          state.form.inputData.trademarkNumber.isValid = false;
        }
        if (key === "brandName") {
          this.brandDebounce({brandName: targetVal});
          state.form.inputData.brandName.fieldOk = false;
          state.form.inputData.brandName.error = "";
          state.form.inputData.brandName.isUnique = false;
        }
        state.form.inputData[key].value = targetVal;
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
    }
  }

  undertakingtoggle () {
    const state = {...this.state};
    state.form.inputData.undertaking.selected = !state.form.inputData.undertaking.selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }

  gotoCompanyRegistration () {
    const steps = this.props.steps ? [...this.props.steps] : [];
    /* eslint-disable no-unused-expressions */
    steps && steps[1] && (steps[1].complete = false);
    this.props.updateOrgData(this.state, "brand");
    this.props.dispatchBrandState(this.state);
    this.props.dispatchSteps(steps);
    this.setState({redirectToCompanyReg: true});
  }

  /* eslint-disable no-empty */
  async updateProfileInfo () {
    try {
      const profile = (await Http.get("/api/userInfo")).body;
      this.props.updateUserProfile(profile);
    } catch (e) {
    }
  }

  /* eslint-disable max-statements */
  async submitOnboardingForm(evt) {
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION_CLICKED, {WORK_FLOW: "COMPANY_ONBOARDING"});
    evt.preventDefault();
    const mixpanelPayload = {
      API: "/api/org/register",
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    try {
      this.loader("form", true);
      const inputData = this.state.form.inputData;
      const brand = {
        trademarkNumber: inputData.trademarkNumber.value,
        usptoUrl: inputData.trademarkNumber.usptoUrl,
        usptoVerification: inputData.trademarkNumber.usptoVerification,
        name: inputData.brandName.value,
        comments: ""
      };
      if (inputData.comments.value) {
        brand.comments = inputData.comments.value;
      }
      const data = {
        org: this.props.org,
        brand
      };
      data.sellerInfo = this.props.org.sellerInfo;
      this.props.org.sellerInfo && delete this.props.org.sellerInfo;
      mixpanelPayload.BRAND_NAME = brand && brand.name;
      mixpanelPayload.COMPANY_NAME = this.props.org && this.props.org.name;
      mixpanelPayload.TRADEMARK_NUMBER = brand && brand.trademarkNumber;
      mixpanelPayload.IS_DOCUMENT_UPLOADED = this.props.org && Boolean(this.props.org.businessRegistrationDocId || this.props.org.additionalDocId);
      await Http.post("/api/org/register", data, {clientType: this.props.clientType});
      this.loader("form", false);
      const meta = { templateName: "CompanyBrandRegisteredTemplate" };
      this.updateProfileInfo();
      this.props.dispatchNewRequest(true);
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
      mixpanelPayload.API_SUCCESS = true;
    } catch (err) {
      this.loader("form", false);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = err.message ? err.message : err;
    } finally {
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION, mixpanelPayload);
    }
  }

  render() {
    if (this.state.redirectToCompanyReg) {
      return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER} />;
    }

    const section = this.state.section;

    return (
      <div className={`row justify-content-center ${this.state.form.loader && "loader"}`}>
        <div className="col-lg-10 col-md-8 col-12 pl-5 pr-0">
          <div className="row title-row mb-4 pl-4">
            <div className="col pl-4">
              <div className="brand-registration-title font-weight-bold">
                {section.sectionTitle}
              </div>
              <div className="brand-registration-subtitle">
                {section.sectionSubTitle}
              </div>
            </div>
          </div>
          {/* eslint-disable react/jsx-handler-names */}
          <form className="brand-reg-form pl-4" onSubmit={this.submitOnboardingForm}>
            {this.getFieldRenders()}
          </form>
        </div>
      </div>
    );
  }
}

BrandRegistration.propTypes = {
  brandState: PropTypes.object,
  brandContent: PropTypes.object,
  clientType: PropTypes.string,
  dispatchBrandState: PropTypes.func,
  dispatchNewRequest: PropTypes.func,
  dispatchSteps: PropTypes.func,
  showNotification: PropTypes.func,
  steps: PropTypes.array,
  toggleModal: PropTypes.func,
  updateOrgData: PropTypes.func,
  updateUserProfile: PropTypes.func,
  org: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

const mapStateToProps = state => {
  return {
    brandContent: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.BRANDREG,
    brandState: state.company && state.company.brandState,
    steps: state.company && state.company.steps,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  dispatchBrandState,
  dispatchNewRequest,
  dispatchSteps,
  showNotification,
  toggleModal,
  updateUserProfile
};

export  default  connect(mapStateToProps, mapDispatchToProps)(BrandRegistration);
