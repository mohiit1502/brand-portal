import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {dispatchSteps} from "../../actions/company/company-actions";
import HomeHeader from "../custom-components/headers/home-header";
import ContentRendererOnboard from "./content-renderer-onboarding/content-renderer-onboard";
import Stepper from "../custom-components/stepper/stepper";
import ClientUtils from "../../utility/ClientUtils";
import "../../styles/onboard/onboarder.scss";


class Onboarder extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      org: "",
      brand: ""
    };
    this.callback = this.callback.bind(this);
  }

  callback(data, section) {
    const state = {...this.state};
    const steps = [...this.props.steps];
    const brandStepIndex = ClientUtils.where(steps, {name: "Brand Info"});
    const companyStepIndex = ClientUtils.where(steps, {name: "Company Info"});
    if (data) {
      // eslint-disable-next-line no-unused-expressions
      section === "company" ? state.org = data : state.brand = data;
      steps[brandStepIndex].active = section === "company";
      steps[companyStepIndex].active = section !== "company";
      steps[companyStepIndex].complete = true;
      steps[brandStepIndex].complete = true;
    }
    this.props.dispatchSteps(steps);
    this.setState({...state});
  }

  render() {
    return (
      <div className="view-container onboard-container">
        <HomeHeader {...this.props}/>
        <div className="onboard-form-container container">
          <Stepper />
          <ContentRendererOnboard {...this.props} {...this.state} updateOrgData={this.callback}/>
        </div>
      </div>
    );
  }

}


Onboarder.propTypes = {
  dispatchSteps: PropTypes.func,
  location: PropTypes.object,
  steps: PropTypes.array,
  userProfile: PropTypes.object
};


const mapStateToProps = state => {
  return {
    steps: state.company && state.company.steps
  };
};

const mapDispatchToProps = {
  dispatchSteps
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarder);

