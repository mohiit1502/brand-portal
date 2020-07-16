import React from "react";
import { connect } from "react-redux";
import walmartLogo from "../../../images/wm-white-logo.png";
import PropTypes from "prop-types";
import "../../../styles/custom-components/headers/home-header.scss";
import CONSTANTS from "../../../constants/constants";

class HomeHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    //TODO: correct the config for logout;

    const baseUrl = CONSTANTS.URL.DOMAIN[process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()];
    const logoutUrl = `https://retaillink.login.stg.wal-mart.com/ssologout?postLogoutRedirect=${baseUrl}/logout`;
    return (
      <nav className="navbar navbar-expand-md navbar-dark home-header-nav">
        <a className="navbar-brand walmart-brand" href="#">
          <img src={walmartLogo} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
          aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item nav-item-help mx-4">
              <a className="nav-link" href="#">
                <span className="badge badge-pill bg-white text-blue"> ? </span> &nbsp; Help
              </a>
            </li>
            <li className="nav-item dropdown nav-item-profile ml-4">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
                aria-expanded="false">
                {`${this.props.userProfile.firstName ? this.props.userProfile.firstName : ""} ${this.props.userProfile.lastName ? this.props.userProfile.lastName : ""}`}
              </a>
              <div className="dropdown-menu dropdown-menu-right no-border-radius shadow-sm mt-2">
                {
                  this.props.isOnboarded && <a className="dropdown-item" href={CONSTANTS.ROUTES.PROFILE.USER}>Profile</a>
                }
                <a className="dropdown-item" href={logoutUrl}>Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

HomeHeader.propTypes = {
  userProfile: PropTypes.object,
  isOnboarded: PropTypes.bool
};


const mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};


export  default  connect(mapStateToProps)(HomeHeader);
