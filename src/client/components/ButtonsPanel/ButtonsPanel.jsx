import React from "react";
import PropTypes from "prop-types";
import "./ButtonsPanel.component.scss";

const ButtonsPanel = props => {

  const buttons = props.buttons && Object.keys(props.buttons).map((buttonKey, key) => {
    const button = props.buttons[buttonKey];
    return <button key={key} type={button.type} className={button.classes} onClick={props.parentRef[button.onChange]} disabled={button.disabled}>{button.text}</button>
  })

  return (
    <div className={`c-ButtonsPanel form-row${props.containerClasses ? " " + props.containerClasses : ""}`}>
      <div className={`col${props.colClasses ? " " + props.colClasses : ""}`}>{buttons}</div>
    </div>
  );
};

ButtonsPanel.propTypes = {
  buttons: PropTypes.object,
  colClasses: PropTypes.string,
  containerClasses: PropTypes.string,
  parentRef: PropTypes.object
};

export default ButtonsPanel;
