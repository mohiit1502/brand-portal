import React from "react";
import { connect } from "react-redux";
import Login from "./login/login";
import Home from "./home";
import {Redirect} from "react-router";
import PropTypes from "prop-types";
import CONSTANTS from "../constants/constants";
import Cookies from "electrode-cookies";
import Http from "../utility/Http";
import {updateUserProfile} from "../actions/user/user-actions";
import StorageSrvc, {STORAGE_TYPES} from "../utility/StorageSrvc";

class Authenticator extends React.Component {

  storageSrvc;

  constructor (props) {
    super(props);
    const COOKIE_NAME = "auth_session_token";
    const sessionCookie = Cookies.get(COOKIE_NAME);
    this.storageSrvc = new StorageSrvc(STORAGE_TYPES.SESSION_STORAGE);
    this.state = {
      isLoggedIn: !!sessionCookie
    };
  }

  componentDidMount() {
    if (this.state.isLoggedIn) {
      this.getProfileInfo();
    } else {
      this.removeSessionProfile();
    }
  }

  async getProfileInfo () {
    try {
      let profile = this.storageSrvc.getJSONItem("userProfile");
      if (!profile) {
        profile = (await Http.get("/api/userInfo")).body;
        this.storageSrvc.setJSONItem("userProfile", profile);
      }

      this.props.updateUserProfile(profile);

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

  render () {

    if (this.state.isLoggedIn) {
      if (this.isRootPath(this.props.location.pathname)) {
        return <Redirect to={CONSTANTS.ROUTES.DEFAULT_REDIRECT_PATH} />;
      } else {
        return <Home {...this.props}/>;
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


