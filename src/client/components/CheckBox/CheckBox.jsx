import React from "react";
import PropTypes from "prop-types";
import "./CheckBox.component.scss";
import * as staticContent from "../../images";

const CheckBox = props => {
  return (
    <div className={`c-CheckBox form-row${props.containerClasses ? " " + props.containerClasses : ""}`}>
      <div className={`col${props.colClasses ? " " + props.colClasses : ""}`}>
        <div className="form-check">
          <input type="checkbox" id={props.id} className={`form-check-input${props.checkBoxClasses ? " " + props.checkBoxClasses : ""}`} checked={props.selected}
                 required={props.required} onChange={props.onChange}/>
          <label className={`form-check-label${props.labelClasses ? " " + props.labelClasses : ""}`} htmlFor={props.id}>
            {props.label}
            {props.tou && <span><a href={staticContent.TOU} target="_blank">{props.touLink}</a></span>}
          </label>
        </div>
      </div>
    </div>
  );
};

CheckBox.propTypes = {
  containerClasses: PropTypes.string,
  colClasses: PropTypes.string,
  checkBoxClasses: PropTypes.string,
  id: PropTypes.string,
  labelClasses: PropTypes.string,
  onChange: PropTypes.func,
  parentRef: PropTypes.object,
  required: PropTypes.bool
};

export default CheckBox;
