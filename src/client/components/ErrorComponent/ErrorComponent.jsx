import React from "react";
import PropTypes from "prop-types";
import "./ErrorComponent.component.scss";

const ErrorComponent = props => {
  return props.error ? <div className={`c-ErrorComponent${props.containerClasses ? ` ${  props.containerClasses}` : ""}`}>
      <small className={`${props.errorClasses}`}>{ props.error }</small>
    </div> : null;
};

ErrorComponent.propTypes = {
  containerClasses: PropTypes.string,
  errorClasses: PropTypes.string,
  error: PropTypes.string
};

export default ErrorComponent;
