import React from "react";
import { connect } from "react-redux";

import WMBPLightLogo from "./../../../images/wmbplightLogo.svg";
import "../../../styles/custom-components/headers/login-header.scss";
import CONSTANTS from "../../../constants/constants";
import mixpanel from "../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../constants/MixPanelConsants";

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
              <a className="nav-link" href={CONSTANTS.URL.REGISTER_REDIRECT} onClick={() => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_REGISTER);}}>Register</a>
            </li>
            {/*<li  className="mx-2 nav-item"><strong>|</strong></li>*/}
            <li  className="mx-2 nav-item middle-list"></li>
            <li className="nav-item pl-4 d-flex align-items-center">
              <a className="nav-link login-button" href={this.state.loginRedirectLink} onClick={() => {
                $("a.nav-link.login-button").addClass("disabled");
                mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_LOGIN);
              } }>Login</a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

LoginHeader.propTypes = {};

const mapStateToProps = state => state;

export default connect(mapStateToProps, dispatch => ({dispatch}))(LoginHeader);
