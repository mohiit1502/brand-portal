import React from "react";
import PropTypes from "prop-types";
import "./Accordion.component.scss";

const Accordion = ({children, data, expanded, setExpanded}) => {
  return (
    <div className="c-Accordion">
      {!data.simple && <div className="c-Accordion__button-container">
        <button className={`c-Accordion__button${expanded ? " expanded" : ""}`} onClick={() => setExpanded(!expanded)}>{data.question}</button>
      </div>}
      {children}
    </div>
  );
};

Accordion.propTypes = {
  children: PropTypes.symbol,
  data: PropTypes.object,
  expanded: PropTypes.bool,
  setExpanded: PropTypes.func
};

export default Accordion;
