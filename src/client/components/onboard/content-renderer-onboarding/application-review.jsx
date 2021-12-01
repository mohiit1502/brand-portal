import React from "react";
import { connect } from "react-redux";
import { dispatchSteps } from "../../../actions/company/company-actions";
import { withRouter } from "react-router";
import CONSTANTS from "../../../constants/constants";
import ApplicationDetails from "../../../components/ApplicationDetails";
class ApplicationReview extends React.Component {
    constructor(props) {
        super(props);
        this.title = "Review Information";
        this.subtitle = "Please ensure the information below is accurate.";
        this.state = { ...props };
    }

    componentDidMount() {
        if (!this.props.org) {
            this.props.history.push(CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER);
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
            <div className="col pl-5 pr-0">
                <div className="row mt-4 pl-5 mx-3 brand-registration-title font-weight-bold font-size-28">
                    {this.title}
                </div>
                <div className="row mt-3 pl-5 mx-3 brand-registration-subtitle">
                    {this.subtitle}
                </div>
                {/* eslint-disable react/jsx-handler-names */}
                <ApplicationDetails {...this.props} />
                <div className="c-ButtonsPanel form-row py-4 mt-5">
                    <div className="col company-onboarding-button-panel text-right">
                        <button type="button" className="btn btn-sm cancel-btn text-primary" onClick={this.gotoBrandRegistration}>Back</button>
                        <button type="submit" className="btn btn-sm btn-primary submit-btn px-4 ml-3">Confirm and submit</button>
                    </div>
                </div>

            </div>
        );

    }

}

const mapStateToProps = state => {
    return {
        steps: state.company && state.company.steps
    };
};

const mapDispatchToProps = {
    dispatchSteps
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ApplicationReview));
