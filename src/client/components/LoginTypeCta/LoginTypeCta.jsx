/* eslint-disable no-shadow, filenames/match-regex */
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {useLocation} from "react-router-dom";
import {dispatchLoginAction, dispatchRegisterAction} from "../../actions";
import {BPDarkLogo} from "./../../images";
import "./LoginTypeCta.component.scss";
import CONSTANTS from "../../constants/constants";

/* eslint-disable complexity */
const LoginTypeCta = props => {
  const {action, dispatchLoginAction, dispatchRegisterAction} = props;
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState();
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

  /* eslint-disable no-nested-ternary */
  return (<div className="c-LoginTypeCta">
      <div className="page-container css-0 d-flex flex-column">
        <div className="logoBox">
          <img src={BPDarkLogo} alt="WBP Dark Logo" className="logo" />
        </div>
        <div className={`main-container position-absolute${!action && " loader"}`}>
          <div className="content-container">
            <div className="padder p-4">
              <div className="tab-content text-center">
                {errorMessage && <div className="cta-error">
                  <p className="error-message">{errorMessage}</p>
                  <span className="close-button" onClick={() => setErrorMessage("")}>×</span>
                </div>}
                <span className="page-header mb-2"><span>{action ? action === "login" ? "Log In" : "Register" : ""}</span></span>
                <p className="sub-title mb-0">Streamline {action === "login" ? "login" : "registration"} by using one of your existing</p>
                <p className="sub-title">Walmart accounts.</p>
                <a href={`${CONSTANTS.URL.LOGIN_REDIRECT}?clientType=seller`} className="app-btn d-block mt-2">{action ? action === "login" ? "Use Seller Center Account" : "Use Seller Center Account" : ""}</a>
                <div className="OrSeperator w-100 d-flex my-4">
                  <hr /><span>OR</span><hr />
                </div>
                {action === "register" && <p className="sub-title">Don't have a Walmart account?</p>}
                <a href={action === "login" ? `${CONSTANTS.URL.LOGIN_REDIRECT}?clientType=supplier` : `${CONSTANTS.URL.REGISTER_REDIRECT}?clientType=supplier`} className="app-btn d-block secondary-btn mt-2">
                  {action ? action === "login" ? "Continue with Brand Portal Log In" : "Register with Brand Portal" : ""}
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="footnote-container mt-4">
              <span className="footnote d-block text-center">
                <span>We recommend setting your monitor resolution to at least 1024 x 768</span>
              </span>
              <span className="footnote d-block text-center">
                <span>U.S. Users: Please use Chrome v49 or newer</span>
              </span>
              <span className="footnote d-block text-center"><span>International Users: Please use Internet Explorer</span>
              </span>
              <span className="footnote d-block text-center">
                <a href="https://corporate.walmart.com/privacy-security" className="policy-link" target="_blank">Privacy Policy</a>
              </span>
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
