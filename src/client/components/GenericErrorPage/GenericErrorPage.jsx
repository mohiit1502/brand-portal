/* eslint-disable complexity */
import React from "react";
import PropTypes from "prop-types";
import CONSTANTS from "../../constants/constants";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import * as images from "../../images";
import "./GenericErrorPage.component.scss";

const GenericErrorPage = props => {
  const mixpanelPayload = {
    IS_GENERIC: props.generic,
    MESSAGE: props.generic ? props.message || "Try to refresh this page or try again later." : "Seller Error"
  };

  if (props.logInId) mixpanelPayload.$email = props.logInId;
  if (props.isLoggedIn) mixpanelPayload.IS_LOGGED_IN = props.isLoggedIn;
  if (props.isOnboarded) mixpanelPayload.IS_ONBOARDED = props.isOnboarded;
  if (props.profileInformationLoaded) mixpanelPayload.IS_PROFILE_LOADED = props.profileInformationLoaded;
  if (props.userInfoError) mixpanelPayload.USER_INFO_ERROR =  props.userInfoError;
  mixpanel.trackEvent(MIXPANEL_CONSTANTS.GENERIC_ERROR.GENERIC_ERROR, mixpanelPayload);

  return (<div className={`${props.containerClass ? props.containerClass + " " : ""} mx-auto c-GenericErrorPage page-error text-center`} style={{maxWidth: "600px"}}>
    <img className="c-GenericErrorPage__image" src={images[props.image || "PageError"]} alt="Page Error" />
    {
      !props.generic ?
        <i>
          <h4 className="c-GenericErrorPage__header font-weight-bold">{props.header || "We’re sorry. An error has occurred."}</h4>
          <ol className="c-GenericErrorPage__message text-left d-inline-block">
            <li>
              If you are a new Brand Portal user, please try the following:
              <ul>
                <li>Visit <a href="/logout">Walmart Brand Portal</a></li>
                <li>Click “Register”</li>
                <li>Create a new account using a different email address than the one used for your Walmart supplier account</li>
              </ul>
            </li>
            <li>If you already have a Brand Portal account and you are seeing this error message, please reach out to us at <a href={`mailto:${CONSTANTS.LOGIN.CONTACTEMAIL}`}>{CONSTANTS.LOGIN.CONTACTEMAIL}</a></li>
          </ol>
        </i>
        :
        <React.Fragment>
          <h4 className="c-GenericErrorPage__header font-weight-bold">{props.header || "Oops. Something went wrong."}</h4>
          <p className="c-GenericErrorPage__message">{props.message || <span>Try to <a href={window.location.pathname}>refresh</a> this page or try again later.</span>}</p>
        </React.Fragment>
    }
    </div>);
};

GenericErrorPage.propTypes = {
  containerClass: PropTypes.string,
  generic: PropTypes.bool,
  header: PropTypes.string,
  image: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  isOnboarded: PropTypes.bool,
  logInId: PropTypes.string,
  message: PropTypes.string,
  profileInformationLoaded: PropTypes.bool,
  userInfoError: PropTypes.string
};

export default GenericErrorPage;
