/* eslint-disable filenames/match-regex */

import React from "react";
import PropTypes from "prop-types";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";

import "./HelpSideBar.component.scss";
import {withRouter} from "react-router";

const HelpSideBar = ({activeTab, categoryHeader, categories, ...props}) => {
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
  const onClickHandler = categoryKey => {
    const path = `/help/${categoryKey}`;
    props.history.push(path);
    helpSectionEvents(MIXPANEL_CONSTANTS.HELP_CENTER_EVENTS.VIEW_HELP_MENU, {id: categoryKey});
  };

  const categoriesRendered = categories && Object.keys(categories).map(categoryKey => {
    const category = categories[categoryKey];
    return (<li key={categoryKey} className={`c-HelpSideBar__category${activeTab === categoryKey ? " active" : ""}`}
      onClick={() => {onClickHandler(categoryKey);}}>
      {category.categoryText}
      </li>);
  });

  return (
    <div className="c-HelpSideBar h-90">
      <div className="c-HelpSideBar__header h4">{categoryHeader}</div>
      <ul id="helpSideBar" className="c-HelpSideBar__categories">
        {categoriesRendered}
      </ul>
    </div>
  );
};

HelpSideBar.propTypes = {
  activeTab: PropTypes.string,
  categories: PropTypes.object,
  categoryHeader: PropTypes.string,
  history: PropTypes.object,
  setActiveTab: PropTypes.func
};

export default withRouter(HelpSideBar);
