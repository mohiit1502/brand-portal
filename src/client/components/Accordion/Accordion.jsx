import React from "react";
import PropTypes from "prop-types";
import "./Accordion.component.scss";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/MixPanelConsants";

const Accordion = ({children, data, expanded, setExpanded}) => {
  return (
    <div className="c-Accordion">
      {!data.simple && <div className="c-Accordion__button-container">
        <button className={`c-Accordion__button${expanded ? " expanded" : ""}`} onClick={() => {setExpanded(!expanded); !expanded && mixpanel.trackEvent(MIXPANEL_CONSTANTS.HELP_CENTER_EVENTS.VIEW_HELP_TOPICS, data); }}>
            {data.question}
        </button>
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
