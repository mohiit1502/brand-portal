import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

import mixpanel from "../../utility/mixpanelutils";

import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import CONSTANTS from "./../../constants/constants";
import WMBPDarkLogo from "./../../images/WMWhite-horizontal.svg";
import "./Footer.component.scss";

const Footer = props => {

  return (
    <div className="c-Footer">
      {!props.isWebform && <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-lg login-footer-nav">
            <div className="c-Footer__logoSocialContainer">
              <img className="c-Footer__wmWhiteLogo" src={WMBPDarkLogo} />
              {/* <span className="c-Footer__logoText">Walmart Brand Portal</span> */}
            </div>
            <div className="collapse navbar-collapse navbar-collapsible-footer" id="collapsible-footer">
              <ul className="navbar-nav ml-auto">
                {/* <li className="nav-item mx-4">
                  <a className="nav-link" href="#">Home</a>
                </li> */}
                <li className="nav-item mx-1 d-flex align-items-center">
                  {/*<a className="nav-link btn login-btn py-1" href={CONSTANTS.URL.LOGIN_REDIRECT} onClick={() => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_LOGIN);}}>Login</a>*/}
                  <Link className="nav-link btn login-btn py-1" to="/login" onClick={() => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_LOGIN);}}>Login</Link>
                  {/*<img className="nav-link" src={youtube}/>*/}
                </li>
                <li className="nav-item ml-1">
                  {/*<a className="nav-link" href={CONSTANTS.URL.REGISTER_REDIRECT} onClick={() => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_REGISTER);}}>Register</a>*/}
                  <Link className="nav-link" to="/register" onClick={() => {mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_REGISTER);}}>Register</Link>
                  {/*<img className="nav-link" src={walmart}/>*/}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>}
      <div className="row">
        <div className="col">
          <div className="c-Footer__copyrightContainer">
            <span className="c-Footer__copyrightText float-left">
              {CONSTANTS.LOGIN.COPYRIGHTTEXT}
              <a target="_blank" href={CONSTANTS.LOGIN.PRIVACYURL} className="c-Footer__privacyNav float-right">{CONSTANTS.LOGIN.PRIVACYTEXT}</a>
            </span>
            {/*<a target="_blank" href={CONSTANTS.LOGIN.PRIVACYURL} className="c-Footer__privacyNav float-right">{CONSTANTS.LOGIN.PRIVACYTEXT}</a>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  isWebform: PropTypes.bool
};

export default Footer;
