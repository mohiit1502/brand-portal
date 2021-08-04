import React from "react";
import PropTypes from "prop-types";
import "./HeaderFormComponent.component.scss";

const HeaderFormComponent = props => {
  return (
    <div className={`c-HeaderFormComponent row form-prompt${props.containerClasses ? " " + props.containerClasses : ""}`}>
      <div className={`col${props.colClasses ? " " + props.colClasses : ""}`}>
        <p>{props.header}</p>
      </div>
    </div>
  );
};

HeaderFormComponent.propTypes = {
  containerClasses: PropTypes.string,
  header: PropTypes.string
};

export default HeaderFormComponent;
