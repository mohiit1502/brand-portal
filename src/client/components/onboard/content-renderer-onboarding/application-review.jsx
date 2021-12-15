/* eslint-disable max-statements */
import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dispatchSteps } from "../../../actions/company/company-actions";
import { toggleModal, TOGGLE_ACTIONS } from "../../../actions/modal-actions";
import ApplicationDetails from "../../../components/ApplicationDetails";
import mixpanel from "../../../utility/mixpanelutils";
import Http from "../../../utility/Http";
import Helper from "../../../utility/helper";
import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";
import CONSTANTS from "../../../constants/constants";

class ApplicationReview extends React.Component {
    constructor(props) {
        super(props);
        this.title = "Review Information";
        this.subtitle = "Please ensure the information below is accurate.";
        const functions = ["gotoBrandRegistration"];
        functions.forEach(name => {
            this[name] = this[name].bind(this);
          });
        this.state = { ...props };
        this.restructureBeforeSubmit = this.restructureBeforeSubmit.bind(this);
        this.submitOnboardingForm = this.submitOnboardingForm.bind(this);
        this.checkAndSubmitOnboardingForm = this.checkAndSubmitOnboardingForm.bind(this);
        this.checkForEdit = this.checkForEdit.bind(this);
        this.state = {
          loader: false
        };

    }

    componentDidMount() {
        if (!this.props.org) {
            this.props.history.push(CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER);
        }
    }

    restructureBeforeSubmit (data) {
      const businessRegistrationDoc = data?.org?.businessRegistrationDocList?.find(doc => !doc.createTS);
      const additionalDoc = data?.brand?.additionalDocList?.find(doc => !doc.createTS);
      data.org = {...data.org, businessRegistrationDoc, additionalDoc};
      delete data?.org?.businessRegistrationDocList;
      delete data?.brand?.additionalDocList;
      if (data.org.sellerInfo) {
        data.sellerInfo = data.org.sellerInfo;
        delete data.org.sellerInfo;
      }
      Object.keys(data).forEach(key => Object.keys(data[key]).length === 0 && delete data[key])
      delete data.company;
    }

    submitOnboardingForm(data, mixpanelPayload) {

        const brand = data && data.brand;
        const org = data && data.org;
        mixpanelPayload.BRAND_NAME = brand && brand.name;
        mixpanelPayload.COMPANY_NAME = org && org.name;
        mixpanelPayload.TRADEMARK_NUMBER = brand && brand.trademarkNumber;
        mixpanelPayload.IS_DOCUMENT_UPLOADED = org && Boolean(org.businessRegistrationDocId || org.additionalDocId);

        Http.post("/api/org/register", data, { clientType: this.props.clientType, context: this.props.userProfile && this.props.userProfile.context})
        .then(res => {
            mixpanelPayload.API_SUCCESS = true;
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, { templateName: "StatusModalTemplate", ...this.props.modalsMeta.APPLICATION_SUBMITTED });
        })
        .catch(err => {
            mixpanelPayload.API_SUCCESS = false;
            mixpanelPayload.ERROR = err.message ? err.message : err;
        })
        .finally(() => {
            this.setState({loader: false});
            mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION, mixpanelPayload);
        });
    }

    // eslint-disable-next-line complexity
    checkForEdit() {
        const orgFieldsArray = ["city", "countryCode", "address", "zip", "name", "state"];
        const brandFieldsArray = ["trademarkNumber", "comments", "name"];
        const payload = {
            "org": {},
            "brand": {}
        };
        const onboardingDetails = this.props.onboardingDetails;
        const originalValues = this.props.originalValues;

        orgFieldsArray.forEach(orgField => {
            if (onboardingDetails.org[orgField] !== originalValues.org[orgField]) {
                payload.org[orgField] = onboardingDetails.org[orgField];
            }
        });

        originalValues && originalValues.orgId && (payload.orgId = originalValues.orgId);
        originalValues && originalValues.brandId && (payload.brandId = originalValues.brandId);

        brandFieldsArray.forEach(brandField => {
            if (onboardingDetails.brand[brandField] !== originalValues.brand[brandField]) {
                payload.brand[brandField] = onboardingDetails.brand[brandField];
            }
        });

        const additionalDocListNew = onboardingDetails.brand.additionalDocList, additionalDocListOrginal = originalValues.brand.additionalDocList,
        businessRegistrationDocListNew = onboardingDetails.org.businessRegistrationDocList, businessRegistrationDocListOriginal = originalValues.org.businessRegistrationDocList;

        if ((businessRegistrationDocListOriginal && !businessRegistrationDocListNew)
            || (!businessRegistrationDocListOriginal && businessRegistrationDocListNew)
            || (businessRegistrationDocListNew && businessRegistrationDocListOriginal && businessRegistrationDocListNew.length !== businessRegistrationDocListOriginal.length)) {
            payload.org["businessRegistrationDocList"] = businessRegistrationDocListNew;
        }

        if ((additionalDocListOrginal && !additionalDocListNew)
            || (!additionalDocListOrginal && additionalDocListNew)
            || (additionalDocListNew && additionalDocListOrginal && additionalDocListNew.length !== additionalDocListOrginal.length)) {
            payload.brand["additionalDocList"] = additionalDocListNew;
        }

        const isDirty = Object.keys(payload).reduce((agg, key) => agg || Object.keys(payload[key]).length > 0, false);
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
          this.setState({loader: true});
          const isEditMode = this.props.userProfile && this.props.userProfile.context === "edit";
          let payload = this.props.onboardingDetails;
          const dirtyCheckResponse = isEditMode && this.checkForEdit();
          if (dirtyCheckResponse && dirtyCheckResponse.isDirty) {
              payload = dirtyCheckResponse.payload;
          }
          if (!payload.org && payload.company) {
              payload.org = payload.company;
              delete payload.company;
          }
          this.restructureBeforeSubmit(payload);
          if ((isEditMode && dirtyCheckResponse.isDirty) || !isEditMode) {
            this.submitOnboardingForm(payload, mixpanelPayload);
          }
        } catch (err) {
            console.log(err);
            mixpanelPayload.API_SUCCESS = false;
            mixpanelPayload.ERROR = err.message ? err.message : err;
        } finally {
            this.setState({loader: false});
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
            // <div className={`row justify-content-center ${this.props.form.loader && "loader"}`}>
            <div className={`col test pl-5 pr-0 ml-5${this.state.loader ? " loader" : ""}`}>
                <div className="row mt-4 pl-5 ml-3 brand-registration-title font-weight-bold font-size-28">
                    {this.title}
                </div>
                <div className="row mt-3 pl-5 ml-3 brand-registration-subtitle">
                    {this.subtitle}
                </div>
                {/* eslint-disable react/jsx-handler-names */}
                <ApplicationDetails {...this.props} />
                <div className="c-ButtonsPanel form-row py-4 mt-5">
                    <div className="col company-onboarding-button-panel text-right mr-5">
                        <button type="button" className="btn btn-sm cancel-btn text-primary" onClick={this.gotoBrandRegistration}>Back</button>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-4 ml-3 mr-5" onClick={this.checkAndSubmitOnboardingForm}>Confirm and submit</button>
                    </div>
                </div>

            </div>
        );

    }

}
ApplicationReview.propTypes = {
    dispatchSteps: PropTypes.func,
    onboardingDetails: PropTypes.object,
    steps: PropTypes.array,
    modalsMeta: PropTypes.object,
    toggleModal: PropTypes.func
};

const mapStateToProps = state => {
    return {
        steps: state.company && state.company.steps,
        onboardingDetails: state.company && state.company.onboardingDetails,
        originalValues: state.company && state.company.originalValues,
        userProfile: state.user && state.user.profile

    };
};

const mapDispatchToProps = {
    dispatchSteps,
    toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ApplicationReview));
