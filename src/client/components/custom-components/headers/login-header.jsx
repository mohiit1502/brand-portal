import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";

import {dispatchLoginAction, dispatchRegisterAction} from "../../../actions";

import CONSTANTS from "../../../constants/constants";
import mixpanel from "../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../constants/mixpanelConstants";
import WMBPLightLogo from "./../../../images/wmbplightLogo.svg";
import "../../../styles/custom-components/headers/login-header.scss";

class LoginHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginRedirectLink: "/api/falcon/login"
    };
  }

  scrollAction() {
    $("#LoginFAQ").addClass("scrolled");
    setTimeout(() => $("#LoginFAQ").removeClass("scrolled"), 1000);
  }

  render() {
    const {dispatchLoginAction, dispatchRegisterAction} = this.props;
    return (
      <nav className="c-LoginHeader navbar navbar-expand-lg navbar-dark login-header-nav">
        <a className="navbar-brand walmart-brand" href="#">
          <img src={WMBPLightLogo} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsible-header"
          aria-controls="collapsible-header" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse navbar-collapsible-header" id="collapsible-header">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item px-4">
              {/* <Link className="nav-link" to="LoginFAQ" smooth={true} duration={500} activeClass="active" spy={true} offset={-700}>FAQ</Link> */}
              <a className="nav-link register-button" href={CONSTANTS.URL.REGISTER_REDIRECT} onClick={() => {
              // <Link className="nav-link register-button" to="/register" onClick={() => {
                dispatchRegisterAction();
                $("a.nav-link.register-button").addClass("disabled");
                mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_REGISTER);
              }}>
                Register
              {/*</Link>*/}
              </a>
            </li>
            {/*<li  className="mx-2 nav-item"><strong>|</strong></li>*/}
            <li  className="mx-2 nav-item middle-list"></li>
            <li className="nav-item pl-4 d-flex align-items-center">
              <a className="nav-link login-button" href={this.state.loginRedirectLink} onClick={() => {
              // <Link className="nav-link login-button" to="/login" onClick={() => {
                dispatchLoginAction();
                $("a.nav-link.login-button").addClass("disabled");
                mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_LOGIN);
              } }>
                Login
              {/*</Link>*/}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

LoginHeader.propTypes = {
  dispatchLoginAction: PropTypes.func,
  dispatchRegisterAction: PropTypes.func
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
  dispatchLoginAction,
  dispatchRegisterAction
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginHeader);
