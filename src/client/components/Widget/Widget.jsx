import React from "react";
import PropTypes from "prop-types";
import {ChartsContainer, Summary} from "../index";
import "./Widget.component.scss";

const contentComponentMap = {
  VERTICALGROUPEDBAR: ChartsContainer,
  SUMMARY: Summary,
  HORIZONTALSTACKEDBAR: ChartsContainer
};

const Widget = props => {
  const {
    data,
    currentFilters,
    fetchComplete,
    userProfile,
    widgetCommon: {
      layoutClasses: commonLayoutClasses = "",
      widgetStyle: commonWidgetStyle = {}
    },
    widget: {
      API,
      DATAKEY,
      ID,
      DETAILS: {
        colClass = "",
        layoutClasses = "",
        widgetStyle = {}
      },
      SUBTYPE,
      TYPE
    },
    widgetStackItem
  } = props;

  const opts = {API, currentFilters, data, DATAKEY, ID, fetchComplete, widgetCommon: props.widgetCommon, userProfile, widgetStackItem, SUBTYPE, widget: props.widget};
  // tableMeta !== undefined && (opts.tableMeta = tableMeta);

  const ContentComponent = contentComponentMap[TYPE];
  const commonLayoutClassesInferred = `${commonLayoutClasses ? ` ${commonLayoutClasses}` : ""}`;
  const layoutClassesInferred = `${layoutClasses ? ` ${layoutClasses}` : ""}`;
  const colClassInferred = `${colClass ? ` ${colClass}` : ""}`;

  return (
    <div id={ID} className={`c-Widget${commonLayoutClassesInferred}${layoutClassesInferred}${colClassInferred}`} style={{...commonWidgetStyle, ...widgetStyle}}>
      <ContentComponent {...opts} />
    </div>
  );
};

Widget.propTypes = {
  authConfig: PropTypes.object,
  currentFilters: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  fetchComplete: PropTypes.bool,
  userProfile: PropTypes.object,
  widget: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgetStackItem: PropTypes.object
};

export default Widget;
