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
        this.submitOnboardingForm = this.submitOnboardingForm.bind(this);
        this.loader = Helper.loader.bind(this);
    }

    componentDidMount() {
        if (!this.props.org) {
            this.props.history.push(CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER);
        }
    }
    /* eslint-disable max-statements */
    submitOnboardingForm(evt) {
        mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION_CLICKED, { WORK_FLOW: "COMPANY_ONBOARDING" });
        evt.preventDefault();
        const mixpanelPayload = {
            API: "/api/org/register",
            WORK_FLOW: "COMPANY_ONBOARDING"
        };
        try {
            this.loader("form", true);
            //   const data = {
            //     org: this.props.org,
            //     brand
            //   };
            //   data.sellerInfo = this.props.org.sellerInfo;
            //   this.props.org.sellerInfo && delete this.props.org.sellerInfo;
            const data = this.props.onboardingDetails;
            const brand = data && data.brand;
            const org = data && data.org;
            mixpanelPayload.BRAND_NAME = brand && brand.name;
            mixpanelPayload.COMPANY_NAME = org && org.name;
            mixpanelPayload.TRADEMARK_NUMBER = brand && brand.trademarkNumber;
            mixpanelPayload.IS_DOCUMENT_UPLOADED = org && Boolean(org.businessRegistrationDocId || org.additionalDocId);
            console.log(data);
            Http.post("/api/org/register", data, { clientType: this.props.clientType })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                mixpanelPayload.API_SUCCESS = false;
                mixpanelPayload.ERROR = err.message ? err.message : err;
            })
            .finally(() => {
                this.loader("form", false);
                mixpanel.trackEvent(MIXPANEL_CONSTANTS.COMPANY_REGISTRATION.ONBOARDING_DETAIL_SUBMISSION, mixpanelPayload);
            });
            // this.updateProfileInfo();
            //   this.props.dispatchNewRequest(true);
            this.props.toggleModal(TOGGLE_ACTIONS.SHOW, { templateName: "StatusModalTemplate", ...this.props.modalsMeta.APPLICATION_SUBMITTED });
            mixpanelPayload.API_SUCCESS = true;
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
            // <div className={`row justify-content-center ${this.props.form.loader && "loader"}`}>
            <div className="col test pl-5 pr-0 ml-5">
                <div className="row mt-4 pl-5 ml-3 brand-registration-title font-weight-bold font-size-28">
                    {this.title}
                </div>
                <div className="row mt-3 pl-5 ml-3 brand-registration-subtitle">
                    {this.subtitle}
                </div>
                {/* eslint-disable react/jsx-handler-names */}
                <ApplicationDetails {...this.props} />
                <div className="c-ButtonsPanel form-row py-4 mt-5">
                    <div className="col company-onboarding-button-panel text-right">
                        <button type="button" className="btn btn-sm cancel-btn text-primary" onClick={this.gotoBrandRegistration}>Back</button>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-4 ml-3 mr-5" onClick={this.submitOnboardingForm}>Confirm and submit</button>
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
        onboardingDetails: state.company && state.company.onboardingDetails

    };
};

const mapDispatchToProps = {
    dispatchSteps,
    toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ApplicationReview));
