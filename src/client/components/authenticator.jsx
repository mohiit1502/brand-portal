/* eslint-disable max-depth, max-statements, no-console, no-magic-numbers */
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
import {dispatchFormFieldMetadata, dispatchModalsMetadata} from "../actions/content/content-actions";
import {GenericErrorPage} from "./index";
import Onboarder from "./onboard/onboarder";
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
    this.fetchModalConfig = preLoadApiUtil.fetchModalConfig.bind(this);
    this.fetchFormFieldConfig = preLoadApiUtil.fetchFormFieldConfig.bind(this);

    this.majorRoutes = {
      dynamic: {
        claims: {
          fetcher: this.fetchClaims,
          dispatcher: this.props.dispatchClaims
        },
        brands: {
          fetcher: this.fetchBrands,
          dispatcher: this.props.dispatchBrands
        },
        users: {
          fetcher: this.fetchUsers,
          dispatcher: this.props.dispatchUsers
        }
      },
      static: {
        formFields: {
          fetcher: this.fetchFormFieldConfig,
          dispatcher: this.props.dispatchFormFieldMetadata
        },
        modals: {
          fetcher: this.fetchModalConfig,
          dispatcher: this.props.dispatchModalsMetadata
        }
      }
    };

    this.state = {
      isLoggedIn: !!sessionCookie,
      isOnboarded: false,
      profileInformationLoaded: false,
      userInfoError: false,
      logInId: Cookies.get("session_token_login_id"),
      clientType: Cookies.get("client_type")
    };
  }

  componentDidMount() {
    if (!mixpanel.getToken()) {
      Http.get("/api/mixpanelConfig")
      .then(res => {
        mixpanel.intializeMixpanel(res.body.projectToken, res.body.enableTracking);
      }).catch(() => mixpanel.intializeMixpanel(CONSTANTS.MIXPANEL.PROJECT_TOKEN));
    }
    if (this.state.isLoggedIn) {
      this.prepareLogoutEnvironment(() => {
        this.initMetaData();
        this.preLoadData();
        this.getProfileInfo();
      });
    } else {
      this.removeSessionProfile();
    }
  }

  logout(logoutUrl, errorType) {
    Cookies.expire("auth_session_token");
    Cookies.expire("session_token_login_id");
    Cookies.expire("client_type");
    const replacer = errorType ? `${window.location.origin}/login?${errorType}` : `${window.location.origin}/login`;
    logoutUrl = logoutUrl.replace("__domain__/logout", replacer);
    window.location.href = logoutUrl;
  }

  preLoadData() {
    Object.keys(this.majorRoutes.dynamic).forEach(currentPath => {
      const sectionObj = this.majorRoutes.dynamic[currentPath];
      sectionObj.fetcher(sectionObj.dispatcher, this.props.logoutUrl, this.state.clientType);
    });
  }

  initMetaData() {
    Object.keys(this.majorRoutes.static).forEach(currentPath => {
      const sectionObj = this.majorRoutes.static[currentPath];
      sectionObj.fetcher(sectionObj.dispatcher);
    });
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
        profile = (await Http.get("/api/userInfo", {clientType: this.state.clientType}, null, null,
          "", "", errorType => this.logout(this.props.logoutUrl, errorType))).body;
        if (this.state.clientType && this.state.clientType === "supplier" && (profile.accountLinked || profile.source === "PAM")) {
          if (profile.accountLinked) {
            this.logout(this.props.logoutUrl, "linked");
          } else {
            this.logout(this.props.logoutUrl,  "invalid_login");
          }
        } else {
          // profile.workflow.code = 1;
          //profile = JSON.parse("{\"firstName\":\"Test\",\"lastName\":\"Mohsin\",\"phoneCountry\":\"1\",\"phoneNumber\":\"(234) 567-8901\",\"emailVerified\":true,\"isUserEnabled\":true,\"organization\":{\"id\":\"640a20c2-3bbd-46e5-9a81-4f97c8bc9f08\",\"status\":\"Accepted\"},\"role\":{\"id\":\"6a429471-3675-4490-93db-5aadf5412a8b\",\"name\":\"Super Admin\",\"description\":\"Brand Rights Owner\"},\"brands\":[{\"id\":\"640a20c2-3bbd-46e5-9a81-4f97c8bc9f08\"}],\"type\":\"Internal\",\"registrationMode\":\"SelfRegistered\",\"email\":\"wm.ropro+testbike@gmail.com\",\"status\":\"Active\",\"statusDetails\":\"Status updated by: system\",\"createdBy\":\"wm.ropro+testbike@gmail.com\",\"createTs\":\"2020-09-15T07:15:18.965Z\",\"lastUpdatedBy\":\"wm.ropro+testbike@gmail.com\",\"lastUpdateTs\":\"2020-09-21T10:06:07.633Z\",\"isOrgEnabled\":true,\"workflow\":{\"code\":4,\"workflow\":\"portal_dashboard\",\"defaultView\":\"portal-view-users\",\"roleCode\":1,\"roleView\":\"SUPER_ADMIN\"}}");
          this.props.updateUserProfile(profile);
        }
      }
      this.setOnboardStatus(profile.organization);
      this.setState({profileInformationLoaded: true});
      mixpanelPayload.API_SUCCESS = true;
    } catch (e) {
      /* eslint-disable no-undef */
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

  prepareLogoutEnvironment (callback) {
    fetch("/api/logoutProvider")
      .then(res => res.text())
      .then(res => this.props.dispatchLogoutUrl(res))
      .finally(() => callback && callback());
  }

  removeSessionProfile () {
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
    let path;
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
    const {modalsMeta} = this.props;
    const WORKFLOW_CODE = this.props.userProfile && this.props.userProfile.workflow && this.props.userProfile.workflow.code;
    if (this.state.isLoggedIn) {
      mixpanel.login(this.state.logInId, MIXPANEL_CONSTANTS.LOGIN.LOGIN_SUCCESS);
      if (this.state.profileInformationLoaded) {
        if (this.isRootPath(this.props.location.pathname)) {
          if (this.state.isOnboarded) {
            const redirectURI = window.localStorage.getItem("redirectURI");
            window.localStorage.removeItem("redirectURI");
            return redirectURI ? <Redirect to={redirectURI} /> : <Redirect to={CONSTANTS.ROUTES.PROTECTED.DASHBOARD} />;
          } else {
            return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER}/>;
          }
        } else if (WORKFLOW_CODE === modalsMeta.PORTAL_REGISTRATION.CODE && !this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER}/>;
        } else if (WORKFLOW_CODE === modalsMeta.PORTAL_DASHBOARD.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Redirect to={CONSTANTS.ROUTES.PROTECTED.DASHBOARD}/>;
        } else if (WORKFLOW_CODE === modalsMeta.PORTAL_REGISTRATION.CODE && this.isOnboardingPath(this.props.location.pathname)) {
          return <Onboarder {...this.props} {...this.state} />;
        } else {
          return <Home {...this.props} {...this.state} isNew={this.props.isNew} />;
        }
      } else if (!this.state.userInfoError) {
        return <div className="fill-parent loader" />;
      } else {
        return <GenericErrorPage generic={this.state.userInfoError !== "USER_INFO_ERROR_NOT_FOUND"} containerClass="mt-12rem" {...this.state}/>;
      }
    } else if (this.isRootPath(this.props.location.pathname)) {
      return <Login {...this.props} />;
    } else if (this.isOneOfRedirectPaths(this.props.location.pathname)) {
      window.localStorage.setItem("redirectURI", this.props.location.pathname);
      window.location.pathname = CONSTANTS.URL.LOGIN_REDIRECT;
      return null;
    } else {
      return <Redirect to={CONSTANTS.ROUTES.PROTECTED.ROOT_PATH} />;
    }
  }
}

Authenticator.propTypes = {
  dispatchFormFieldMetadata: PropTypes.func,
  dispatchModalsMetadata: PropTypes.func,
  dispatchClaims: PropTypes.func,
  dispatchBrands: PropTypes.func,
  dispatchUsers: PropTypes.func,
  dispatchLogoutUrl: PropTypes.func,
  dispatchMixpanelConfig: PropTypes.func,
  dispatchMetadata: PropTypes.func,
  isNew: PropTypes.bool,
  location: PropTypes.object,
  logoutUrl: PropTypes.string,
  modalsMeta: PropTypes.object,
  updateUserProfile: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    isNew: state.company.isNew,
    logoutUrl: state.user.logoutUrl,
    userProfile: state.user.profile,
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {}
  };
};

const mapDispatchToProps = {
  dispatchFormFieldMetadata,
  dispatchModalsMetadata,
  updateUserProfile,
  dispatchLogoutUrl,
  dispatchClaims,
  dispatchBrands,
  dispatchUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticator);


