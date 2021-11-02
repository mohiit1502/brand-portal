/* eslint-disable no-empty */

import React from "react";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import Helper from "../../utility/helper";
import "./ButtonsPanel.component.scss";

const ButtonsPanel = props => {

  const evaluateButtonText = button => {
    let buttonText = button.text;
    try {
      const buttonCondition = button.textObj && JSON.parse(button.textObj);
      const buttonConditionValue = buttonCondition && Helper.search(buttonCondition.condition, props.parentRef);
      buttonText = buttonConditionValue !== undefined ? buttonCondition[buttonConditionValue] : buttonText;
    } catch (e) {}
    return buttonText;
  };

  const buttons = props.buttons && Object.keys(props.buttons).map((buttonKey, key) => {
    try {
      const button = props.buttons[buttonKey];
      const parentRef = props.parentRef;
      const shouldRender = ContentRenderer.evaluateRenderDependency.call(parentRef, button.renderCondition);
      const handler = button.handlerArg !== undefined ? () => parentRef[button.onClick](button.handlerArg) : parentRef[button.onClick];
      const buttonText = evaluateButtonText(button);
      return shouldRender && <button key={key} type={button.type} className={button.classes} onClick={handler}
        disabled={button.disabled}>{buttonText}</button>;
    } catch (e) {}
    return null;
  });

  return props.bareButton ? buttons : (
    <div data-test={"button-panel"} className={`c-ButtonsPanel form-row${props.containerClasses ? ` ${  props.containerClasses}` : ""}`}>
      <div data-test={"button-div"} className={`col${props.colClasses ? ` ${  props.colClasses}` : ""}`}>{buttons}</div>
    </div>
  );
};

ButtonsPanel.propTypes = {
  bareButton: PropTypes.bool,
  buttons: PropTypes.object,
  colClasses: PropTypes.string,
  containerClasses: PropTypes.string,
  parentRef: PropTypes.object
};

export default ButtonsPanel;
