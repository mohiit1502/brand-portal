/* eslint-disable max-statements */
import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dispatchSteps } from "../../../actions/company/company-actions";
import { toggleModal, TOGGLE_ACTIONS } from "../../../actions/modal-actions";
import {NOTIFICATION_TYPE, showNotification} from "../../../actions/notification/notification-actions";

import ApplicationDetails from "../../../components/ApplicationDetails";
import mixpanel from "../../../utility/mixpanelutils";
import Http from "../../../utility/Http";
import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";
import CONSTANTS from "../../../constants/constants";

class ApplicationReview extends React.Component {
    constructor(props) {
        super(props);
        this.title = "Application Review";
        this.subtitle = "Please ensure the information below is accurate.";
        const functions = ["gotoBrandRegistration", "restructureBeforeDirtyCheck", "restructureBeforeSubmit", "submitOnboardingForm", "checkAndSubmitOnboardingForm", "checkForEdit"];
        functions.forEach(name => {
            this[name] = this[name].bind(this);
        });
        this.state = { ...props };
        this.state = {
          loader: false,
          dirtyCheckResponse: {},
          isEditMode: false
        };

    }

    componentDidMount() {
        if (!this.props.org) {
            this.props.history.push(CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER);
        }
        const isEditMode = this.props.userProfile && this.props.userProfile.context === "edit";
        this.setState({isEditMode});
        this.restructureBeforeDirtyCheck();
        isEditMode && this.setState({dirtyCheckResponse: this.checkForEdit()});
    }

    restructureBeforeDirtyCheck() {
        const data = this.props.onboardingDetails;
        if (!data.org && data.company) {
          data.org = data.company;
          delete data.company;
        }
        const countryOptions = this.props.companyContent ? this.props.companyContent.fields.country.selectableCountries : [];
        const selectedCountry = countryOptions.find(country => country.value === data.org.countryCode);
        data.org.countryCode = selectedCountry ? selectedCountry.code : data.org.countryCode;
    }

    restructureBeforeSubmit (data) {
      if (!data.org && data.company) {
        data.org = data.company;
        delete data.company;
      }
      const businessRegistrationDoc = data.org && data.org.businessRegistrationDocList && data.org.businessRegistrationDocList.find(doc => !doc.createTS);
      const additionalDoc = data.brand && data.brand.additionalDocList && data.brand.additionalDocList.find(doc => !doc.createTS);
      data.org = {...data.org, businessRegistrationDoc, additionalDoc};
      data.org && delete data.org.businessRegistrationDocList;
      data.brand && delete data.brand.additionalDocList;
      data.org.primaryContactInformation = {
          firstName: this.props.userProfile.firstName,
          lastName: this.props.userProfile.lastName,
          phone: (this.props.userProfile.phoneNumber !== undefined) ? this.props.userProfile.phoneNumber : "0000000000",
          email: this.props.userProfile.email
      };
      if (data.org.sellerInfo) {
        data.sellerInfo = data.org.sellerInfo;
        delete data.org.sellerInfo;
      }
      Object.keys(data).forEach(key => Object.keys(data[key]).length === 0 && delete data[key]);
    }

    submitOnboardingForm(data, mixpanelPayload) {

        const brand = data && data.brand;
      if(brand && !(brand.trademarkNumber)){
        delete brand.trademarkClasses;
        delete brand.usptoUrl;
      }

        const org = data && data.org;
        mixpanelPayload.BRAND_NAME = brand && brand.name;
        mixpanelPayload.COMPANY_NAME = org && org.name;
        mixpanelPayload.TRADEMARK_NUMBER = brand && brand.trademarkNumber;
        mixpanelPayload.IS_DOCUMENT_UPLOADED = org && Boolean(org.businessRegistrationDocId || org.additionalDocId);
        this.props.setLoader && this.props.setLoader(true);
        Http.post("/api/org/register", data, { clientType: this.props.clientType, context: this.props.userProfile && this.props.userProfile.context})
        .then(res => {
            this.setState({
                applicationSubmitted: true
            });
            mixpanelPayload.API_SUCCESS = true;
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, { templateName: "StatusModalTemplate", ...this.props.modalsMeta.APPLICATION_SUBMITTED });
        })
        .catch(err => {
            if (err.error && err.error.code === "MAXIMUM_RETRY_EXHAUSTED") {
                this.props.showNotification(NOTIFICATION_TYPE.ERROR, "Application limit exhausted!");
            } else {
              this.props.showNotification(NOTIFICATION_TYPE.ERROR, "Submission failed, please try again!");
            }
            mixpanelPayload.API_SUCCESS = false;
            mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
            this.props.setLoader && this.props.setLoader(false);
            mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION, mixpanelPayload);
        });
    }

    // eslint-disable-next-line complexity
    checkForEdit() {
        const modifiableFields = {
          org: ["city", "countryCode", "address", "zip", "name", "state"],
          brand: ["trademarkNumber", "comments", "name"]
        };
        const payload = {
            org: {},
            brand: {}
        };
        const onboardingDetails = this.props.onboardingDetails;
        const originalValues = this.props.originalValues;

        if (originalValues && onboardingDetails) {
            Object.keys(modifiableFields).forEach(key => {
          const fieldArray = modifiableFields[key];
          fieldArray.forEach(field => {
            if ((onboardingDetails[key][field] && !originalValues[key][field])
              || ((!onboardingDetails[key][field] && originalValues[key][field]))
              || (onboardingDetails[key][field] && originalValues[key][field] && onboardingDetails[key][field].trim() !== originalValues[key][field].trim())) {
              payload[key][field] = onboardingDetails[key][field];
            }
          });
        });

        // populate payload with mapping brand and org IDs
        originalValues && originalValues.orgId && (payload.orgId = originalValues.orgId);
        originalValues && originalValues.brandId && (payload.brandId = originalValues.brandId);

        // populate payload with changed documents
        const additionalDocListNew = onboardingDetails.brand.additionalDocList || [];
        const businessRegistrationDocListNew = onboardingDetails.org.businessRegistrationDocList || [];

        if (businessRegistrationDocListNew && businessRegistrationDocListNew.findIndex(doc => !doc.createTS) > -1) {
            payload.org.businessRegistrationDocList = businessRegistrationDocListNew;
        }

        if (additionalDocListNew && additionalDocListNew.findIndex(doc => !doc.createTS) > -1) {
            payload.brand.additionalDocList = additionalDocListNew;
        }

        }
        // populate payload with non-document changed fields
        const isDirty = Object.keys(payload).reduce((agg, key) => agg || (typeof payload[key] === "object" && Object.keys(payload[key]).length > 0), false);
        return {isDirty, payload};
    }

    /* eslint-disable max-statements */
    // eslint-disable-next-line complexity
    checkAndSubmitOnboardingForm(evt) {
        const mixpanelPayload = {
            API: "/api/org/register",
            WORK_FLOW: "COMPANY_ONBOARDING"
        };
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION_CLICKED, { WORK_FLOW: "COMPANY_ONBOARDING" });
        evt.preventDefault();

        try {
          const isEditMode = this.state.isEditMode;
          let payload = this.props.onboardingDetails;
          const dirtyCheckResponse = this.state.dirtyCheckResponse;
          if (dirtyCheckResponse && dirtyCheckResponse.isDirty) {
              payload = dirtyCheckResponse.payload;
          }
          this.restructureBeforeSubmit(payload);
          if ((isEditMode && dirtyCheckResponse.isDirty) || !isEditMode) {
            this.submitOnboardingForm(payload, mixpanelPayload);
          } else {
            this.props.showNotification(NOTIFICATION_TYPE.ERROR, "Nothing was changed!");
          }
        } catch (err) {
            mixpanelPayload.API_SUCCESS = false;
            mixpanelPayload.ERROR = err.message ? err.message : err;
        }
    }


    gotoBrandRegistration(evt) {
        evt.preventDefault();
        const steps = this.props.steps ? [...this.props.steps] : [];
        if (steps && steps[1]) {
            steps[2].active = false;
            steps[2].complete = false;
            steps[1].active = true;
        }
        this.props.dispatchSteps(steps);
        this.props.history.push("/onboard/brand");
    }

    render() {
        return (
            <div className="col pl-5 pr-0">
                <div className="row mt-4 pl-5 ml-5 brand-registration-title font-weight-bold font-size-28">
                    <span className="col">{this.title}</span>
                </div>
                <div className="row mt-3 mb-4 pl-5 ml-5 brand-registration-subtitle">
                    <span className="col">{this.subtitle}</span>
                </div>
                {/* eslint-disable react/jsx-handler-names */}
                <ApplicationDetails {...this.props} />
                <div className="c-ButtonsPanel form-row py-4 mt-5">
                    <div className="col company-onboarding-button-panel text-right mr-5">
                        <button type="button" className="btn btn-sm cancel-btn text-primary" disabled={this.state.applicationSubmitted} onClick={this.gotoBrandRegistration}>Back</button>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-4 ml-3" onClick={this.checkAndSubmitOnboardingForm}
                                disabled={(this.state.isEditMode && this.state.dirtyCheckResponse && !this.state.dirtyCheckResponse.isDirty) || this.state.applicationSubmitted}>
                          Confirm and submit
                        </button>
                    </div>
                </div>

            </div>
        );

    }

}
ApplicationReview.propTypes = {
    dispatchSteps: PropTypes.func,
    onboardingDetails: PropTypes.object,
    originalValues: PropTypes.object,
    steps: PropTypes.array,
    modalsMeta: PropTypes.object,
    toggleModal: PropTypes.func,
    showNotification: PropTypes.func
};

const mapStateToProps = state => {
    return {
      companyContent: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.COMPANYREG,
      steps: state.company && state.company.steps,
      onboardingDetails: state.company && state.company.onboardingDetails,
      originalValues: state.company && state.company.originalValues,
      userProfile: state.user && state.user.profile
    }
};

const mapDispatchToProps = {
    dispatchSteps,
    toggleModal,
    showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ApplicationReview));
