import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


class Onboarder extends React.Component{

  render() {
    return (
      <div>
        Onboard here
      </div>
    );
  }

}


Onboarder.propTypes = {
  location: PropTypes.object,
  updateUserProfile: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => state;

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(Onboarder);
