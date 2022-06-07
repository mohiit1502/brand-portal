import React from "react";
import PropTypes from "prop-types";
import "./HeaderFormComponent.component.scss";
import * as images from "../../images";
import Tooltip from "../custom-components/tooltip/tooltip";

const HeaderFormComponent = props => {
  const tooltipContent = {
    orderNumberContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          {/*<li>Upload IP Registration Documents or Letter of Authorization</li>*/}
          <li>You can include multiple order numbers using "," to separate them.</li>
        </ul>
      </ol>
    </div>
  };
  return (
    <div className={`c-HeaderFormComponent row form-prompt${props.containerClasses ? ` ${  props.containerClasses}` : ""}`}>
      <div className={`col${props.colClasses ? ` ${  props.colClasses}` : ""}`}>
        <p>{props.header} { props.tooltipContentKey && <Tooltip placement={"right"}
                                  content={tooltipContent[props.tooltipContentKey]}
                                  icon={images[props.icon]}/> }</p>
      </div>
    </div>

  );
};

HeaderFormComponent.propTypes = {
  colClasses: PropTypes.string,
  containerClasses: PropTypes.string,
  header: PropTypes.string
};

export default HeaderFormComponent;
