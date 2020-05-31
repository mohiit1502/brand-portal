import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import HomeHeader from "../headers/home-header";
import ContentRendererOnboard from "./content-renderer-onboarding/content-renderer-onboard";
import Stepper from "../stepper/stepper";


class Onboarder extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="view-container home-container">
        <HomeHeader {...this.props}/>
        <Stepper />
        <ContentRendererOnboard {...this.props}/>
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

