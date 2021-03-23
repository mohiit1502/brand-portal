/* eslint-disable max-depth */
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
import {dispatchLogoutUrl, updateUserProfile} from "../actions/user/user-actions";
import {dispatchMetadata} from "../actions/content/content-actions";
import {GenericErrorPage} from "./index";
import Onboarder from "./onboard/onboarder";
import FORMFIELDCONFIG from "../config/formsConfig/form-field-meta";
import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/MixPanelConsants";

class Authenticator extends React.Component {

  constructor (props) {
    super(props);
    const COOKIE_NAME = "auth_session_token";
    const sessionCookie = Cookies.get(COOKIE_NAME);

    this.state = {
      isLoggedIn: !!sessionCookie,
      isOnboarded: false,
      profileInformationLoaded: false,
      userInfoError: false
    };
  }

  componentDidMount() {
    //TODO MX intialise
    mixpanel.intializeMixpanel();
    if (this.state.isLoggedIn) {
      this.initMetaData();
      this.getProfileInfo();
      this.prepareLogoutEnvironment();
    } else {
      this.removeSessionProfile();
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.userProfile !== this.props.userProfile) {
      //this.setOnboardStatus(this.props.userProfile.organization);
    }
  }

  initMetaData() {
    Http.get("/api/formConfig")
      .then(response => {
        if (response.body) {
          try {
            response = JSON.parse(response.body);
            // response = FORMFIELDCONFIG;
            this.props.dispatchMetadata(response);
          } catch (e) {
            this.props.dispatchMetadata(FORMFIELDCONFIG);
          }
        }
      })
      .catch(err => console.log(err));
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
        //profile = JSON.stringify("{\"firstName\":\"Test\",\"lastName\":\"Mohsin\",\"phoneCountry\":\"1\",\"phoneNumber\":\"(234) 567-8901\",\"emailVerified\":true,\"isUserEnabled\":true,\"organization\":{\"id\":\"640a20c2-3bbd-46e5-9a81-4f97c8bc9f08\",\"status\":\"Accepted\"},\"role\":{\"id\":\"6a429471-3675-4490-93db-5aadf5412a8b\",\"name\":\"Super Admin\",\"description\":\"Brand Rights Owner\"},\"brands\":[{\"id\":\"640a20c2-3bbd-46e5-9a81-4f97c8bc9f08\"}],\"type\":\"Internal\",\"registrationMode\":\"SelfRegistered\",\"email\":\"wm.ropro+testbike@gmail.com\",\"status\":\"Active\",\"statusDetails\":\"Status updated by: system\",\"createdBy\":\"wm.ropro+testbike@gmail.com\",\"createTs\":\"2020-09-15T07:15:18.965Z\",\"lastUpdatedBy\":\"wm.ropro+testbike@gmail.com\",\"lastUpdateTs\":\"2020-09-21T10:06:07.633Z\",\"isOrgEnabled\":true,\"workflow\":{\"code\":4,\"workflow\":\"portal_dashboard\",\"defaultView\":\"portal-view-users\",\"roleCode\":1,\"roleView\":\"SUPER_ADMIN\"}}");
        this.props.updateUserProfile(profile);
      }
      this.setOnboardStatus(profile.organization);
      this.setState({profileInformationLoaded: true});

    } catch (e) {
      //console.error(e);
      this.setState({userInfoError: e.status === 404 ? "USER_INFO_ERROR_NOT_FOUND" : "USER_INFO_ERROR_GENERIC"});
    }
  }

  prepareLogoutEnvironment () {
    fetch("/api/logoutProvider")
      .then(res => res.text())
      .then(res => this.props.dispatchLogoutUrl(res));
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
        mixpanel.login(this.props.userProfile, MIXPANEL_CONSTANTS.LOGIN.USER_LOGIN);
        if (this.isRootPath(this.props.location.pathname)) {
          if (this.state.isOnboarded) {
            const redirectURI = window.localStorage.getItem("redirectURI");
            window.localStorage.removeItem("redirectURI");
            // return redirectURI ? <Redirect to={redirectURI} /> : <Redirect to={CURRENT_USER_DEFAULT_PATH}/>;
            return redirectURI ? <Redirect to={redirectURI} /> : <Redirect to={CONSTANTS.ROUTES.DASHBOARD} />;
          } else {
            return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}/>;
          }
        // } else if (this.props.userProfile.workflow.code === 1) {
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_REGISTRATION.CODE && !this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_DASHBOARD.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.DASHBOARD}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_REGISTRATION.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Onboarder {...this.props} {...this.state} />;
        } else {
          return <Home {...this.props} {...this.state} isNew={this.props.isNew} />;
        }
      } else {
        return !this.state.userInfoError ? <div className="fill-parent loader" /> : <GenericErrorPage generic={this.state.userInfoError !== "USER_INFO_ERROR_NOT_FOUND"} containerClass="mt-12rem"/>;
      }
    } else if (this.isRootPath(this.props.location.pathname)) {
      return <Login {...this.props} />;
    } else if (this.isOneOfRedirectPaths(this.props.location.pathname)) {
      window.localStorage.setItem("redirectURI", this.props.location.pathname);
      window.location.pathname = CONSTANTS.URL.LOGIN_REDIRECT;
      return null;
      // return <Redirect to={CONSTANTS.ROUTES.ROOT_PATH} />;
    } else {
      return <Redirect to={CONSTANTS.ROUTES.ROOT_PATH} />;
    }
  }
}

Authenticator.propTypes = {
  dispatchLogoutUrl: PropTypes.func,
  dispatchMetadata: PropTypes.func,
  isNew: PropTypes.bool,
  location: PropTypes.object,
  updateUserProfile: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    isNew: state.company.isNew,
    userProfile: state.user.profile
  };
};

const mapDispatchToProps = {
  dispatchMetadata,
  updateUserProfile,
  dispatchLogoutUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticator);


