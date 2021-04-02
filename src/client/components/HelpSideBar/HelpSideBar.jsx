import React from "react";
import PropTypes from "prop-types";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/MixPanelConsants";

import "./HelpSideBar.component.scss";

const HelpSideBar = ({activeTab, categoryHeader, categories, setActiveTab}) => {

  const onClickHandler = categoryKey => {
    setActiveTab(categoryKey);
    mixpanel.helpSectionEvents(MIXPANEL_CONSTANTS.HELP_CENTER_EVENTS.VIEW_HELP_MENU, {id: categoryKey});
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
  setActiveTab: PropTypes.func
};

export default HelpSideBar;
