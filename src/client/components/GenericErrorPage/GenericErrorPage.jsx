import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from "../../constants/constants";
import * as images from "../../images";
import './GenericErrorPage.component.scss';

const GenericErrorPage = props => {
  return <div className={`${props.containerClass ? props.containerClass + " " : ""} mx-auto c-GenericErrorPage page-error text-center`} style={{maxWidth: "600px"}}>
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
    </div>;
};

GenericErrorPage.propTypes = {
  containerClass: PropTypes.string,
  generic: PropTypes.bool,
  image: PropTypes.string,
  header: PropTypes.string,
  message: PropTypes.string
};

export default GenericErrorPage;
