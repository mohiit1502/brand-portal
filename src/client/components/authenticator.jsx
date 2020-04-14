import React from "react";
import { connect } from "react-redux";
import Login from "./login/login";
import Home from "./home";
import {Redirect} from "react-router";
import PropTypes from "prop-types";
import CONSTANTS from "../constants/constants";

class Authenticator extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isLoggedIn: true
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


