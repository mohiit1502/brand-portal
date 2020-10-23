import React from "react";
import PropTypes from "prop-types";
import WidgetContainer from "../WidgetContainer";
import "./WidgetSectionContainer.component.scss";

const WidgetSectionContainer = props => {

  const {sections, ...opts} = props;

  const sectionsRender = sections && Object.keys(sections).map((sectionKey, index) => {
    const section = props.sections[sectionKey];
    return (
      <div id={section.ID} key={`${sectionKey}-${index}`} className={section.SECTIONCLASSES}>
        <div className={section.SECTIONTITLECLASSES}>{section.SECTIONTITLE}</div>
        <WidgetContainer widgets={section.WIDGETS} {...opts} />
      </div>);
  })
  return (
    <div className="c-WidgetSectionContainer px-25 py-3 h-90">
      {sectionsRender}
    </div>
  );
};

WidgetSectionContainer.propTypes = {
  authConfig: PropTypes.object,
  data: PropTypes.object,
  fetchComplete: PropTypes.bool,
  sections: PropTypes.object,
  tableMeta: PropTypes.object,
  userProfile: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgetStack: PropTypes.object
};

export default WidgetSectionContainer;
