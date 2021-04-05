import React from "react";
import PropTypes from "prop-types";
import "./Accordion.component.scss";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/MixPanelConsants";

const Accordion = ({children, data, expanded, setExpanded}) => {

  const helpSectionEvents = (eventName, payLoad) => {
    let helpId = payLoad.id;
    helpId = helpId.split("-")[0];
    const updatedPayload = {
        HELP_TOPIC: MIXPANEL_CONSTANTS.HELP_TOPIC_MAPPING[helpId],
        WORK_FLOW: "HELP_EVENTS"
    };
    if (payLoad.question) updatedPayload.QUESTION = payLoad.question;
    mixpanel.trackEvent(eventName, updatedPayload);
  };
  const onClickHandler = () => {
    setExpanded(!expanded);
    if (!expanded) helpSectionEvents(MIXPANEL_CONSTANTS.HELP_CENTER_EVENTS.VIEW_HELP_TOPICS, data);
  };

  return (
    <div className="c-Accordion">
      {!data.simple && <div className="c-Accordion__button-container">
        <button className={`c-Accordion__button${expanded ? " expanded" : ""}`} onClick={() => {onClickHandler();}}>
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
