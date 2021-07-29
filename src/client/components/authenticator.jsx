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
import {dispatchClaims} from "../actions/claim/claim-actions";
import {dispatchBrands} from "../actions/brand/brand-actions";
import {dispatchUsers} from "../actions/user/user-actions";
import {dispatchMetadata} from "../actions/content/content-actions";
import {GenericErrorPage} from "./index";
import Onboarder from "./onboard/onboarder";
import FORMFIELDCONFIG from "../config/formsConfig/form-field-meta";
import mixpanel from "../utility/mixpanelutils";
import {preLoadApiUtil} from "../utility/preLoadApiUtil";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";

class Authenticator extends React.Component {

  constructor (props) {
    super(props);
    const COOKIE_NAME = "auth_session_token";
    const sessionCookie = Cookies.get(COOKIE_NAME);

    this.fetchClaims = preLoadApiUtil.fetchClaims.bind(this);
    this.fetchBrands = preLoadApiUtil.fetchBrands.bind(this);
    this.fetchUsers = preLoadApiUtil.fetchUsers.bind(this);

    this.majorRoutes = {
      "claims": {
        fetcher: this.fetchClaims,
        dispatcher: this.props.dispatchClaims
      },
      "brands": {
        fetcher: this.fetchBrands,
        dispatcher: this.props.dispatchBrands
      },
      "users": {
        fetcher: this.fetchUsers,
        dispatcher: this.props.dispatchUsers
      }
    }

    this.state = {
      isLoggedIn: !!sessionCookie,
      isOnboarded: false,
      profileInformationLoaded: false,
      userInfoError: false,
      logInId: Cookies.get("session_token_login_id")
    };
  }

  componentDidMount() {
    if (!mixpanel.getToken()) {
      Http.get("/api/mixpanelConfig")
      .then(res => {
        mixpanel.intializeMixpanel(res.body.projectToken, res.body.enableTracking);
      }).catch(e => mixpanel.intializeMixpanel(CONSTANTS.MIXPANEL.PROJECT_TOKEN));
    }
    if (this.state.isLoggedIn) {
      this.initMetaData();
      this.preLoadData();
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

  preLoadData() {
    Object.keys(this.majorRoutes).forEach(currentPath => {
      const sectionObj = this.majorRoutes[currentPath];
      sectionObj.fetcher(sectionObj.dispatcher);
    })
  }

  initMetaData() {
    try {
      this.props.dispatchMetadata(FORMFIELDCONFIG);
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
        });
    } catch (err) {
      console.log(err);
  }
}

  setOnboardStatus (status) {
    return this.setState({isOnboarded: !!status});
  }

  // eslint-disable-next-line complexity
  async getProfileInfo () {
    let mixpanelPayload = {
      API: "/api/userInfo",
      $email: this.state.logInId
    };
    let profile;
    try {
      profile = this.props.userProfile;
      if (!profile || Object.keys(profile).length === 0) {
        profile = (await Http.get("/api/userInfo")).body;
        // profile.workflow.code=1;
        //profile = JSON.parse("{\"firstName\":\"Test\",\"lastName\":\"Mohsin\",\"phoneCountry\":\"1\",\"phoneNumber\":\"(234) 567-8901\",\"emailVerified\":true,\"isUserEnabled\":true,\"organization\":{\"id\":\"640a20c2-3bbd-46e5-9a81-4f97c8bc9f08\",\"status\":\"Accepted\"},\"role\":{\"id\":\"6a429471-3675-4490-93db-5aadf5412a8b\",\"name\":\"Super Admin\",\"description\":\"Brand Rights Owner\"},\"brands\":[{\"id\":\"640a20c2-3bbd-46e5-9a81-4f97c8bc9f08\"}],\"type\":\"Internal\",\"registrationMode\":\"SelfRegistered\",\"email\":\"wm.ropro+testbike@gmail.com\",\"status\":\"Active\",\"statusDetails\":\"Status updated by: system\",\"createdBy\":\"wm.ropro+testbike@gmail.com\",\"createTs\":\"2020-09-15T07:15:18.965Z\",\"lastUpdatedBy\":\"wm.ropro+testbike@gmail.com\",\"lastUpdateTs\":\"2020-09-21T10:06:07.633Z\",\"isOrgEnabled\":true,\"workflow\":{\"code\":4,\"workflow\":\"portal_dashboard\",\"defaultView\":\"portal-view-users\",\"roleCode\":1,\"roleView\":\"SUPER_ADMIN\"}}");
        this.props.updateUserProfile(profile);
      }
      this.setOnboardStatus(profile.organization);
      this.setState({profileInformationLoaded: true});
      mixpanelPayload.API_SUCCESS = true;
    } catch (e) {
      console.error(e);
      this.setState({userInfoError: e.status === 404 ? "USER_INFO_ERROR_NOT_FOUND" : "USER_INFO_ERROR_GENERIC"});
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = e.message ? e.message : e;
      mixpanelPayload.USER_INFO_ERROR = e.status === 404 ? "USER_INFO_ERROR_NOT_FOUND" : "USER_INFO_ERROR_GENERIC";
    } finally {
      mixpanel.setUserProperty(profile);
      const getUserProfilePayload = mixpanel.populateProfileInfo(profile);
      mixpanelPayload = {...mixpanelPayload, ...getUserProfilePayload};
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.LOGIN.GET_USER_PROFILE, mixpanelPayload);
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
    return pathname === CONSTANTS.ROUTES.PROTECTED.ROOT_PATH;
  }

  isOneOfRedirectPaths (pathname) {
    return new RegExp(CONSTANTS.REGEX.REDIRECTALLOWEDPATHS).test(pathname);
  }

  isOnboardingPath (pathname) {
    for (const i in CONSTANTS.ROUTES.PROTECTED.ONBOARD) {
      if (pathname === CONSTANTS.ROUTES.PROTECTED.ONBOARD[i]) {
        return true;
      }
    }
    return false;
  }

  getCurrentUserDefaultPath = role => {
    let path = "";
    switch (role) {
      case CONSTANTS.USER.ROLES.SUPERADMIN:
        path = CONSTANTS.ROUTES.PROTECTED.DEFAULT_REDIRECT_PATH_SUPERADMIN;
        break;
      case CONSTANTS.USER.ROLES.ADMIN:
        path = CONSTANTS.ROUTES.PROTECTED.DEFAULT_REDIRECT_PATH_ADMIN;
        break;
      case CONSTANTS.USER.ROLES.REPORTER:
        path = CONSTANTS.ROUTES.PROTECTED.DEFAULT_REDIRECT_PATH_REPORTER;
        break;
       default:
        path = CONSTANTS.ROUTES.PROTECTED.DEFAULT_REDIRECT_PATH_REPORTER;
    }
    return path;
  }

  // eslint-disable-next-line complexity
  render () {
    const role = this.props.userProfile && this.props.userProfile.role ? this.props.userProfile.role.name : "";
    const CURRENT_USER_DEFAULT_PATH = this.getCurrentUserDefaultPath(role);
    const WORKFLOW_CODE = this.props.userProfile && this.props.userProfile.workflow && this.props.userProfile.workflow.code;
    if (this.state.isLoggedIn) {
      mixpanel.login(this.state.logInId, MIXPANEL_CONSTANTS.LOGIN.LOGIN_SUCCESS);
      if (this.state.profileInformationLoaded) {
        if (this.isRootPath(this.props.location.pathname)) {
          if (this.state.isOnboarded) {
            const redirectURI = window.localStorage.getItem("redirectURI");
            window.localStorage.removeItem("redirectURI");
            // return redirectURI ? <Redirect to={redirectURI} /> : <Redirect to={CURRENT_USER_DEFAULT_PATH}/>;
            return redirectURI ? <Redirect to={redirectURI} /> : <Redirect to={CONSTANTS.ROUTES.PROTECTED.DASHBOARD} />;
          } else {
            return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER}/>;
          }
        // } else if (this.props.userProfile.workflow.code === 1) {
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_REGISTRATION.CODE && !this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_DASHBOARD.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.PROTECTED.DASHBOARD}/>;
        } else if (WORKFLOW_CODE === CONSTANTS.CODES.PORTAL_REGISTRATION.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Onboarder {...this.props} {...this.state} />;
        } else {
          return <Home {...this.props} {...this.state} isNew={this.props.isNew} />;
        }
      } else {
        if(!this.state.userInfoError){
          return <div className="fill-parent loader" />
        }else if(this.state.userInfoError === "USER_INFO_ERROR_NOT_FOUND"){
          Cookies.expire("auth_session_token");
          Cookies.expire("session_token_login_id");
          mixpanel.clearCookies();
          window.location.replace("/api/falcon/logout");
          return null;
        }else{
          return <GenericErrorPage generic={this.state.userInfoError !== "USER_INFO_ERROR_NOT_FOUND"} containerClass="mt-12rem" {...this.state}/>
        }
      }
    }else if (this.isRootPath(this.props.location.pathname)) {
      return <Login {...this.props} />;
    } else if (this.isOneOfRedirectPaths(this.props.location.pathname)) {
      window.localStorage.setItem("redirectURI", this.props.location.pathname);
      window.location.pathname = CONSTANTS.URL.LOGIN_REDIRECT;
      return null;
      // return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ROOT_PATH} />;
    } else {
      return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ROOT_PATH} />;
    }
  }
}

Authenticator.propTypes = {
  dispatchLogoutUrl: PropTypes.func,
  dispatchMixpanelConfig: PropTypes.func,
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
  dispatchLogoutUrl,
  dispatchClaims,
  dispatchBrands,
  dispatchUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticator);


