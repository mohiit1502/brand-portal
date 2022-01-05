/* eslint-disable filenames/match-regex */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {toggleModal, TOGGLE_ACTIONS} from "../../../actions/modal-actions";
import CONSTANTS from "../../../constants/constants";
import profilePic from "../../../images/user-profile.png";
import "../../../styles/custom-components/headers/home-header.scss";
import mixpanel from "../../../utility/mixpanelutils";

import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";

class UserMenu extends React.Component {
  constructor (props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.logoutModalDeterminer = {
      routes: ["/onboard/company", "/onboard/review", "/profile", "/onboard/brand"],
      codes: [1, 4]
    };
  }

  handleLogout() {
    const {modalsMeta} = this.props;
    const workflowCode = this.props.userProfile && this.props.userProfile.workflow && this.props.userProfile.workflow.code;
    const mixpanelPayload = {
      WORK_FLOW: MIXPANEL_CONSTANTS.MIXPANEL_WORKFLOW_MAPPING[workflowCode ? workflowCode : 0] || "CODE_NOT_FOUND"
    };
    const path = this.props.history.location.pathname;
    const showLogoutPrompt = Object.keys(this.logoutModalDeterminer).reduce((acc, key) => {
      const matchObj = this.logoutModalDeterminer[key];
      return acc && matchObj.indexOf(key === "routes" ? path : workflowCode) > -1;
    }, true);

    if (showLogoutPrompt) {
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...modalsMeta.LOGOUT});
    } else {
      mixpanel.logout(MIXPANEL_CONSTANTS.LOGOUT.LOGOUT, mixpanelPayload);
      const baseUrl = window.location.origin;
      const logoutUrl = this.props.logoutUrl && this.props.logoutUrl.replace("__domain__", baseUrl);
      window.location.href = logoutUrl;
    }
  }

  render() {
    const workflowCode = this.props.userProfile && this.props.userProfile.workflow && this.props.userProfile.workflow.code;
    const CODE_DASHBOARD = 4;
    return (
      <li className="nav-item dropdown nav-item-profile ml-4">
        <Link to="#" className="nav-link user-name dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
          aria-expanded="false">
          <img src={profilePic} alt="Profile Pic" height="32px" className="pr-2"/>{`${this.props.userProfile
          && this.props.userProfile.firstName ? this.props.userProfile.firstName : ""} ${this.props.userProfile
          && this.props.userProfile.lastName ? this.props.userProfile.lastName : ""}`}
        </Link>
        <div className="dropdown-menu dropdown-menu-right no-border-radius shadow-sm mt-2">
          {
            workflowCode === CODE_DASHBOARD && <Link className="dropdown-item" to={CONSTANTS.ROUTES.PROTECTED.PROFILE.USER} onClick={ () => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_PROFILE.VIEW_USER_PROFILE);}}>Profile</Link>
          }
          <Link className="dropdown-item" onClick={this.handleLogout}>Logout</Link>
        </div>
      </li>
    );
  }
}

UserMenu.propTypes = {
  isOnboarded: PropTypes.bool,
  logoutUrl: PropTypes.string,
  userProfile: PropTypes.object,
  history: PropTypes.array
};


const mapStateToProps = state => {
  return {
    userProfile: state.user.profile,
    logoutUrl: state.user.logoutUrl,
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {}

  };
};

const mapDispatchToProps = {
  toggleModal
};

export  default  connect(mapStateToProps, mapDispatchToProps)(withRouter(UserMenu));
