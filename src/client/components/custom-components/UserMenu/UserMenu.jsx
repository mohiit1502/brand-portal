/* eslint-disable filenames/match-regex */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import CONSTANTS from "../../../constants/constants";
import profilePic from "../../../images/user-profile.png"
import "../../../styles/custom-components/headers/home-header.scss";
import mixpanel from "../../../utility/mixpanelutils";

import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";

class UserMenu extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const baseUrl = window.location.origin;
    const logoutUrl = this.props.logoutUrl && this.props.logoutUrl.replace("__domain__", baseUrl);
    const workflowCode = this.props.userProfile && this.props.userProfile.workflow && this.props.userProfile.workflow.code;
    const mixpanelPayload = {
      WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[workflowCode ? workflowCode : 0] || "CODE_NOT_FOUND"
    };
    return (
            <li className="nav-item dropdown nav-item-profile ml-4">
              <Link to="#" className="nav-link user-name dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                aria-expanded="false">
                <img src={profilePic} height="32px" className="pr-2"/>{`${this.props.userProfile.firstName ? this.props.userProfile.firstName : ""} ${this.props.userProfile.lastName ? this.props.userProfile.lastName : ""}`}
              </Link>
              <div className="dropdown-menu dropdown-menu-right no-border-radius shadow-sm mt-2">
                {
                  this.props.isOnboarded && <a className="dropdown-item" href={CONSTANTS.ROUTES.PROTECTED.PROFILE.USER} onClick={ () => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.VIEW_USER_PROFILE);}}>Profile</a>
                }
                <a className="dropdown-item" href={logoutUrl} onClick={() => {mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);}}>Logout</a>
              </div>
            </li>
    );
  }
}

UserMenu.propTypes = {
  isOnboarded: PropTypes.bool,
  logoutUrl: PropTypes.string,
  userProfile: PropTypes.object
};


const mapStateToProps = state => {
  return {
    userProfile: state.user.profile,
    logoutUrl: state.user.logoutUrl
  };
};

export  default  connect(mapStateToProps)(UserMenu);
