import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import HomeHeader from "../custom-components/headers/home-header";
import ContentRendererOnboard from "./content-renderer-onboarding/content-renderer-onboard";
import Stepper from "../custom-components/stepper/stepper";
import ClientUtils from "../../utility/ClientUtils";


class Onboarder extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      org: "",
      brand: "",
      steps: [
        {
          order: 1,
          name: "Company Profile",
          complete: true
        },
        {
          order: 2,
          name: "Brand Details",
          complete: false
        }
      ]
    };
    this.callback = this.callback.bind(this);
  }

  callback(org) {
    const state = {...this.state};
    const brandStepIndex = ClientUtils.where(state.steps, {name: "Brand Details"});
    state.steps[brandStepIndex].complete = true;
    state.steps = [...state.steps];
    if (org) {
      state.org = org;
    }
    this.setState({...state});
  }

  render() {
    return (
      <div className="view-container home-container">
        <HomeHeader {...this.props}/>
        <Stepper steps={this.state.steps}/>
        <ContentRendererOnboard {...this.props} {...this.state} updateOrgData={this.callback}/>
      </div>
    );
  }

}


Onboarder.propTypes = {
  location: PropTypes.object,
  userProfile: PropTypes.object
};

const mapStateToProps = state => state;

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(Onboarder);

