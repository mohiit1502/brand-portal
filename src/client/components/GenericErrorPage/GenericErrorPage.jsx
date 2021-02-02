import React from 'react';
import PropTypes from 'prop-types';
import * as images from "../../images";
import './GenericErrorPage.component.scss';

const GenericErrorPage = props => {
  return (
    <div className={`${props.containerClass ? props.containerClass + " " : ""}c-GenericErrorPage page-error text-center`}>
      <img className="c-GenericErrorPage__image" src={images[props.image || "PageError"]} alt="Page Error" />
      <h4 className="c-GenericErrorPage__header font-weight-bold">{props.header || "Oops. Something went wrong."}</h4>
      <p className="c-GenericErrorPage__message">{props.message || "Try to refresh this page or try again later."}</p>
    </div>
  );
};

GenericErrorPage.propTypes = {
  containerClass: PropTypes.string,
  image: PropTypes.string,
  header: PropTypes.string,
  message: PropTypes.string
};

export default GenericErrorPage;
