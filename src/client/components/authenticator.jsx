import React from "react";
import { connect } from "react-redux";
import Login from "./login/login";
import Home from "./home";
import {Redirect} from "react-router";
import PropTypes from "prop-types";
import CONSTANTS from "../constants/constants";
import Cookies from "electrode-cookies";

class Authenticator extends React.Component {

  constructor (props) {
    super(props);
    const COOKIE_NAME = "auth_session_token";
    const sessionCookie = Cookies.get(COOKIE_NAME);

    this.state = {
      isLoggedIn: !!sessionCookie
    };
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
  location: PropTypes.object
};


export default connect()(Authenticator);


