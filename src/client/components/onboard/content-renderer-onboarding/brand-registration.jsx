/* eslint-disable max-statements */
/* eslint-disable no-unused-expressions */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router";
import Cookies from "electrode-cookies";

import {dispatchBrandState, dispatchNewRequest, dispatchSteps, dispatchOnboardingDetails} from "../../../actions/company/company-actions";
import {updateUserProfile} from "../../../actions/user/user-actions";
import {showNotification} from "../../../actions/notification/notification-actions";
import Helper from "../../../utility/helper";
import CONSTANTS from "../../../constants/constants";
import Validator from "../../../utility/validationUtil";
import DocumentActions from "../../../utility/docOps";
import ContentRenderer from "../../../utility/ContentRenderer";
import mixpanel from "../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";
import "./../../../styles/onboard/content-renderer-onboarding/brand-registration.scss";

class BrandRegistration extends React.Component {

  constructor(props) {
    super(props);
    const functions = ["bubbleValue", "onChange", "gotoCompanyRegistration", "undertakingtoggle", "goToApplicationReview"];
    const debounceFunctions = {brandDebounce: "checkBrandUniqueness", trademarkDebounce: "checkTrademarkValidity"};
    functions.forEach(name => {
      this[name] = this[name].bind(this);
    });
    Object.keys(debounceFunctions).forEach(name => {
      const functionToDebounce = Validator[debounceFunctions[name]] ? Validator[debounceFunctions[name]].bind(this) : this[debounceFunctions[name]];
      this[name] = Helper.debounce(functionToDebounce, CONSTANTS.APIDEBOUNCETIMEOUT);
    });
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    this.displayProgressAndUpload = DocumentActions.displayProgressAndUpload.bind(this);
    this.cancelSelection = DocumentActions.cancelSelection.bind(this);
    const brandConfiguration = this.props.brandContent ? this.props.brandContent : {};
    this.state = this.props.brandState && Object.keys(this.props.brandState).length > 0 ? this.props.brandState : {
      redirectToCompanyReg: !this.props.org,
      section: {...brandConfiguration.sectionConfig},
      clientType: Cookies.get("client_type"),
      form: {
        ...brandConfiguration.formConfig,
        inputData: {...brandConfiguration.fields},
        formPopulated: false
      }
    };
    const mixpanelPayload = {
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.BRAND_REGISTRATION, mixpanelPayload);
  }

  componentDidMount() {
    if (!this.state.form.formPopulated && this.props.userProfile && this.props.userProfile.context === "edit") {
      this.prepopulateFields();
    }
  }

  prepopulateFields() {
    if (this.props.onboardingDetails) {
      const data = this.props.onboardingDetails.brand;
      const form = {...this.state.form};
      if (data) {
        form.inputData.trademarkNumber.value = data.trademarkNumber;
        form.inputData.brandName.value = data.name;
        form.formPopulated = true;
        // form.inputData.comments.value = data.comments;
        form.inputData.trademarkNumber.isValid = true;
        form.inputData.brandName.isUnique = true;

        this.setState({form}, this.checkToEnableSubmit);
      }
    }
  }

  // eslint-disable-next-line max-statements
  goToApplicationReview(evt) {
      evt.preventDefault();
      let docNames = this.props.onboardingDetails?.brand?.additionalDocList || [];
      const steps = this.props.steps ? JSON.parse(JSON.stringify(this.props.steps)) : [];
      if (steps) {
        steps[1].active = false;
        steps[2].complete = true;
        steps[2].active = true;
      }
      const inputData = this.state.form.inputData;
      const brand = {
        trademarkNumber: inputData.trademarkNumber.value,
        usptoUrl: inputData.trademarkNumber.usptoUrl,
        usptoVerification: inputData.trademarkNumber.usptoVerification,
        name: inputData.brandName.value,
        // comments: inputData.comments.value
      };

      const currentDocId = this.state.form.inputData.additionalDoc.id;
      docNames = docNames.filter(doc => doc.createTS);
      currentDocId && docNames.push({
        documentId: this.state.form.inputData.additionalDoc.id,
        documentName: this.state.form.inputData.additionalDoc.filename
      });
      if (docNames.length > 0) {
        brand.additionalDocList = [...docNames];
      }
      if (inputData.comments.value) {
        brand.comments = inputData.comments.value;
      }
      this.triggerUpdaters(brand, steps);
  }

  triggerUpdaters (brand, steps) {
      this.props.updateOrgData(brand, "brand");
      this.props.dispatchOnboardingDetails({...this.props.onboardingDetails, brand });
      this.props.dispatchSteps(steps);
      this.props.history.push("/onboard/review");
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
    if (form.inputData.additionalDoc.uploading) {
      form.inputData.brandOnboardingActions.buttons.submit.disabled = true;
    }
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
        const isEditMode = this.props.userProfile?.context === "edit";
        if (key === "trademarkNumber") {
          if (!isEditMode || (isEditMode && this.props.originalValues?.brand?.trademarkNumber?.trim() !== targetVal?.trim())) {
            this.trademarkDebounce();
            state.form.inputData.trademarkNumber.fieldAlert = false;
            state.form.inputData.trademarkNumber.fieldOk = false;
            state.form.inputData.trademarkNumber.error = "";
            state.form.inputData.trademarkNumber.isValid = false;
          } else {
            state.form.inputData.trademarkNumber.isValid = true;
          }
        }
        if (key === "brandName") {
          if (!isEditMode || (isEditMode && this.props.originalValues?.brand?.name?.trim() !== targetVal?.trim())) {
            this.brandDebounce({brandName: targetVal});
            state.form.inputData.brandName.fieldOk = false;
            state.form.inputData.brandName.error = "";
            state.form.inputData.brandName.isUnique = false;
          } else {
            state.form.inputData.brandName.isValid = true;
          }
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
    const steps = this.props.steps ? JSON.parse(JSON.stringify(this.props.steps)) : [];
    /* eslint-disable no-unused-expressions */
    if (steps) {
      steps[1].complete = false;
      steps[1].active = false;
      steps[0].active = true;
    }
    this.props.updateOrgData(this.state, "brand");
    this.props.dispatchBrandState(this.state);
    this.props.dispatchSteps(steps);
    this.props.history.push("/onboard/company");
  }

  render() {
    if (this.state.redirectToCompanyReg) {
      return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER} />;
    }

    const section = this.state.section;

    return (
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-8 col pl-5 pr-0 mx-5">
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
          <form className="brand-reg-form pl-4">
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
  updateOrgData: PropTypes.func,
  updateUserProfile: PropTypes.func,
  org: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};

const mapStateToProps = state => {
  return {
    brandContent: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.BRANDREG,
    brandState: state.company && state.company.brandState,
    steps: state.company && state.company.steps,
    userProfile: state.user.profile,
    onboardingDetails: state.company && state.company.onboardingDetails,
    originalValues: state.company && state.company.originalValues
  };
};

const mapDispatchToProps = {
  dispatchBrandState,
  dispatchNewRequest,
  dispatchSteps,
  dispatchOnboardingDetails,
  showNotification,
  updateUserProfile
};

export  default  connect(mapStateToProps, mapDispatchToProps)(withRouter(BrandRegistration));
