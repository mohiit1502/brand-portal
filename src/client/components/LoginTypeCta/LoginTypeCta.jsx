/* eslint-disable no-shadow, filenames/match-regex */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link, useLocation} from "react-router-dom";
import {dispatchLoginAction, dispatchRegisterAction} from "../../actions";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import {BPDarkLogo} from "./../../images";
import Http from "../../utility/Http";
import CONSTANTS from "../../constants/constants";
import "./LoginTypeCta.component.scss";

/* eslint-disable complexity */
const LoginTypeCta = props => {
  const {action, dispatchLoginAction, dispatchRegisterAction} = props;
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState();
  const [loader, setLoader] = useState(false);
  const ACCOUNT_LINKING_ERROR = "Your Walmart Brand Portal account has been linked to your Seller Center account. To access the Brand Portal, use your Seller Center username and password to log in.";
  const GENERIC_ERROR = "Please login using your credentials.";
  const INVALID_LOGIN_ERROR = "We found an existing seller account corresponding to this email. Please continue using Seller Center username and password to login.";

  useEffect(() => {
    if (!action && location.pathname) {
      if (location.pathname.endsWith("/login")) {
        dispatchLoginAction();
        if (location.search) {
          const params = location.search.indexOf("?") > -1 ? location.search.substring(location.search.indexOf("?") + 1) : location.search;
          let errorMessage;
          switch (params) {
            case "linked":
              errorMessage = ACCOUNT_LINKING_ERROR;
              break;
            case "invalid_login":
              errorMessage = INVALID_LOGIN_ERROR;
              break;
            case "unauthorized":
              errorMessage = GENERIC_ERROR;
              break;
            default:
              errorMessage = "";
          }
          setErrorMessage(errorMessage);
        }
      } else if (location.pathname.endsWith("/register")) {
        dispatchRegisterAction();
      }
    }
  }, [action, location]);

  useEffect(() => {
    if (!mixpanel.initialized) {
      setLoader(true);
      Http.get("/api/mixpanelConfig")
        .then(res => {
          mixpanel.initializeMixpanel(res.body.projectToken, res.body.enableTracking);
          setLoader(false);
        })
        .catch(() => {
          mixpanel.initializeMixpanel(CONSTANTS.MIXPANEL.PROJECT_TOKEN, true);
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
  }, [])

  /* eslint-disable no-nested-ternary */
  return (<div className="c-LoginTypeCta">
      <div className="page-container css-0 d-flex flex-column">
        <div className="logoBox">
          <img src={BPDarkLogo} alt="WBP Dark Logo" className="logo" />
        </div>
        <div className="main-container position-absolute">
          <div className={`content-container${!action || loader ? " loader" : ""}`}>
            <div className="padder p-4">
              <div className="tab-content text-center">
                {errorMessage && <div className="cta-error">
                  <p className="error-message">{errorMessage}</p>
                  <span className="close-button" onClick={() => setErrorMessage("")}>×</span>
                </div>}
                <span className="page-header mb-2"><span>{action ? action === "login" ? "Log In" : "Register" : ""}</span></span>
                <p className="sub-title mb-0">Streamline {action === "login" ? "login" : "registration"} by using one of your existing</p>
                <p className="sub-title">Walmart accounts.</p>
                <a href={`${CONSTANTS.URL.LOGIN_REDIRECT}?clientType=seller`}
                   className="app-btn d-block mt-2"
                   onClick={() => mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS.CLICK_ON_LOGIN, {CLIENT_TYPE: "seller"})}>
                  {action ? "Use Seller Center Account" : ""}
                </a>
                <div className="OrSeparator w-100 d-flex my-4">
                  <hr /><span>OR</span><hr />
                </div>
                {action === "register" && <p className="sub-title">Don't have a Walmart account?</p>}
                <a href={action === "login" ? `${CONSTANTS.URL.LOGIN_REDIRECT}?clientType=supplier` : `${CONSTANTS.URL.REGISTER_REDIRECT}?clientType=supplier`}
                   className="app-btn d-block secondary-btn mt-2"
                   onClick={() => mixpanel.trackEvent(MIXPANEL_CONSTANTS.HOME_PAGE_EVENTS[action === "login" ? "CLICK_ON_LOGIN" : "CLICK_ON_REGISTER"], {CLIENT_TYPE: "supplier"})}>
                  {action ? action === "login" ? "Continue with Brand Portal Log In" : "Register with Brand Portal" : ""}
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="footnote-container mt-4">
              <span className="footnote d-block text-center">
                We recommend setting your monitor resolution to at least 1024 x 768
              </span>
              <span className="footnote d-block text-center">
                U.S. Users: Please use Chrome v49 or newer
              </span>
              <span className="footnote d-block text-center">
                International Users: Please use Internet Explorer
              </span>
              <a href="https://corporate.walmart.com/privacy-security" className="footnote d-block text-center policy-link" target="_blank">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>);
};

LoginTypeCta.propTypes = {
  action: PropTypes.string,
  dispatchLoginAction: PropTypes.func,
  dispatchRegisterAction: PropTypes.func
};

const mapStateToProps = state => {
  return {
    action: state.userRegistration.action
  };
};

const mapDispatchToProps = {
  dispatchLoginAction,
  dispatchRegisterAction
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginTypeCta);
