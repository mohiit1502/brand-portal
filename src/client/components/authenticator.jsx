/* eslint-disable max-statements */
import React from "react";
import { connect } from "react-redux";
import Login from "./login/login";
import Home from "./home/home";
import {Redirect} from "react-router";
import PropTypes from "prop-types";
import CONSTANTS from "../constants/constants";
import Cookies from "electrode-cookies";
import Http from "../utility/Http";
import {updateUserProfile} from "../actions/user/user-actions";
import StorageSrvc, {STORAGE_TYPES} from "../utility/StorageSrvc";
import Onboarder from "./onboard/onboarder";

class Authenticator extends React.Component {

  storageSrvc;

  constructor (props) {
    super(props);
    const COOKIE_NAME = "auth_session_token";
    const sessionCookie = Cookies.get(COOKIE_NAME);
    this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);

    this.state = {
      isLoggedIn: !!sessionCookie,
      isOnboarded: false,
      profileInformationLoaded: false
    };
  }

  componentDidMount() {
    if (this.state.isLoggedIn) {
      this.getProfileInfo();
    } else {
      this.removeSessionProfile();
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.userProfile !== this.props.userProfile) {
      //this.setOnboardStatus(this.props.userProfile.organization);
    }
  }

  setOnboardStatus (status) {
    return this.setState({isOnboarded: !!status});
  }

  async getProfileInfo () {
    try {
      let profile = this.storageSrvc.getJSONItem("userProfile");
      if (!profile) {
        profile = (await Http.get("/api/userInfo")).body;
        this.storageSrvc.setJSONItem("userProfile", profile);
      }
      this.setOnboardStatus(profile.organization);
      this.props.updateUserProfile(profile);
      this.setState({profileInformationLoaded: true});

    } catch (e) {
      console.error(e);
    }
  }

  removeSessionProfile () {
    this.storageSrvc.removeItem("userProfile");
  }

  isRootPath (pathname) {
    return pathname === CONSTANTS.ROUTES.ROOT_PATH;
  }

  isOnboardingPath (pathname) {
    for (const i in CONSTANTS.ROUTES.ONBOARD) {
      if (pathname === CONSTANTS.ROUTES.ONBOARD[i]) {
        return true;
      }
    }
    return false;
  }

  getCurrentUserDefaultPath = role => {
    let path = "";
    switch (role) {
      case CONSTANTS.USER.ROLES.SUPERADMIN:
        path = CONSTANTS.ROUTES.DEFAULT_REDIRECT_PATH_SUPERADMIN;
        break;
      case CONSTANTS.USER.ROLES.ADMIN:
        path = CONSTANTS.ROUTES.DEFAULT_REDIRECT_PATH_ADMIN;
        break;
      case CONSTANTS.USER.ROLES.REPORTER:
        path = CONSTANTS.ROUTES.DEFAULT_REDIRECT_PATH_REPORTER;
        break;
    }
    return path;
  }

  // eslint-disable-next-line complexity
  render () {
    const role = this.props.userProfile && this.props.userProfile.role ? this.props.userProfile.role.name : "";
    const CURRENT_USER_DEFAULT_PATH = this.getCurrentUserDefaultPath(role);
    const WORKFLOW_CODE = this.props.userProfile && this.props.userProfile.workflow && this.props.userProfile.workflow.code;
    if (this.state.isLoggedIn) {
      if (this.state.profileInformationLoaded) {
        if (this.isRootPath(this.props.location.pathname)) {
          if (this.state.isOnboarded) {
            return <Redirect to={CURRENT_USER_DEFAULT_PATH}/>;
          } else {
            return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}/>;
          }
        // } else if (this.props.userProfile.workflow.code === 1) {
        } else if (WORKFLOW_CODE === CONSTANTS.TEMPLATE.PORTAL_VERIFICATION.CODE && !this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.TEMPLATE.PORTAL_DASHBOARD.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CURRENT_USER_DEFAULT_PATH}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.TEMPLATE.PORTAL_VERIFICATION.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Onboarder {...this.props} {...this.state} />;
        } else {
          return <Home {...this.props} {...this.state}/>;
        }
      } else {
        return <div> Loading... </div>;
      }
    } else  if (this.isRootPath(this.props.location.pathname)) {
      return <Login {...this.props} />;
    } else {
      return <Redirect to={CONSTANTS.ROUTES.ROOT_PATH} />;
    }
  }
}

Authenticator.propTypes = {
  location: PropTypes.object,
  updateUserProfile: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    userProfile: state.userProfile
  };
};

const mapDispatchToProps = {
  updateUserProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticator);


