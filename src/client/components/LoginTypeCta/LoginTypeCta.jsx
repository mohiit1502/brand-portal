import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {useLocation} from "react-router-dom";
import {dispatchLoginAction, dispatchRegisterAction} from "../../actions";
import {BPDarkLogo} from "./../../images";
import "./LoginTypeCta.component.scss";

const LoginTypeCta = props => {
  const {action, dispatchLoginAction, dispatchRegisterAction} = props;
  const location = useLocation();

  useEffect(() => {
    if (!action && location.pathname) {
      if (location.pathname.endsWith("/login")) {
        dispatchLoginAction()
      } else if (location.pathname.endsWith("/register")) {
        dispatchRegisterAction();
      }
    }
  }, [action, location])

  return <div className="c-LoginTypeCta">
      <div className="page-container css-0 d-flex flex-column">
        <div className="logoBox">
          <img src={BPDarkLogo} alt="WBP Dark Logo" className="logo" />
        </div>
        <div className={`main-container position-absolute${!action && " loader"}`}>
          <div className="content-container">
            <div className="padder p-4">
              <div className="tab-content text-center">
                <span className="page-header mb-2"><span>{action ? action === "login" ? "Log In" : "Register" : ""}</span></span>
                <p className="sub-title mb-0">Streamline {action === "login" ? "login" : "registration"} by using one of your existing</p>
                <p className="sub-title">Walmart accounts.</p>
                <a href={action === "login" ? "/api/falcon/login" : "/api/falcon/register"} className="app-btn d-block mt-2">{action ? action === "login" ? "Log in with Seller Center" : "Use Seller Center Account" : ""}</a>
                <div className="OrSeperator w-100 d-flex my-4">
                  <hr /><span>OR</span><hr />
                </div>
                {action === "register" && <p className="sub-title">Don't have a Walmart account?</p>}
                <a href={action === "login" ? "/api/falcon/login" : "/api/falcon/register"} className="app-btn d-block secondary-btn mt-2">{action ? action === "login" ? "Use Brand Portal log in" : "Register with Brand Portal" : ""}</a>
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
    </div>
};

LoginTypeCta.propTypes = {
  action: PropTypes.string
};

const mapStateToProps = state => {
  return {
    action: state.userRegistration.action
  }
}

const mapDispatchToProps = {
  dispatchLoginAction,
  dispatchRegisterAction
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginTypeCta);
