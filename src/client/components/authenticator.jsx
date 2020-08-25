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
import Onboarder from "./onboard/onboarder";

class Authenticator extends React.Component {

  constructor (props) {
    super(props);
    const COOKIE_NAME = "auth_session_token";
    const sessionCookie = Cookies.get(COOKIE_NAME);

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
      let profile = this.props.userProfile;
      if (!profile || Object.keys(profile).length === 0) {
        profile = (await Http.get("/api/userInfo")).body;
        // profile.workflow.code=1;
        this.props.updateUserProfile(profile);
      }
      this.setOnboardStatus(profile.organization);
      this.setState({profileInformationLoaded: true});

    } catch (e) {
      console.error(e);
    }
  }

  removeSessionProfile () {
    // this.storageSrvc.removeItem("userProfile");
    this.props.updateUserProfile(undefined);
  }

  isRootPath (pathname) {
    return pathname === CONSTANTS.ROUTES.ROOT_PATH;
  }

  isOneOfRedirectPaths (pathname) {
    return new RegExp(CONSTANTS.REGEX.REDIRECTALLOWEDPATHS).test(pathname);
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
       default:
        path = CONSTANTS.ROUTES.DEFAULT_REDIRECT_PATH_REPORTER;
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
            const redirectURI = localStorage.getItem("redirectURI");
            localStorage.removeItem("redirectURI");
            return redirectURI ? <Redirect to={redirectURI} /> : <Redirect to={CURRENT_USER_DEFAULT_PATH}/>;
          } else {
            return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}/>;
          }
        // } else if (this.props.userProfile.workflow.code === 1) {
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_REGISTRATION.CODE && !this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_DASHBOARD.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CURRENT_USER_DEFAULT_PATH}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_REGISTRATION.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Onboarder {...this.props} {...this.state} />;
        } else {
          return <Home {...this.props} {...this.state} isNew={this.props.isNew} />;
        }
      } else {
        return <div> Loading... </div>;
      }
    } else if (this.isRootPath(this.props.location.pathname)) {
      return <Login {...this.props} />;
    } else if (this.isOneOfRedirectPaths(this.props.location.pathname)) {
      localStorage.setItem("redirectURI", this.props.location.pathname);
      window.location.pathname = "/api/falcon/login";
      return null;
      // return <Redirect to={CONSTANTS.ROUTES.ROOT_PATH} />;
    } else {
      return <Redirect to={CONSTANTS.ROUTES.ROOT_PATH} />;
    }
  }
}

Authenticator.propTypes = {
  isNew: PropTypes.bool,
  location: PropTypes.object,
  updateUserProfile: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    isNew: state.company.isNew,
    userProfile: state.userProfile
  };
};

const mapDispatchToProps = {
  updateUserProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticator);


