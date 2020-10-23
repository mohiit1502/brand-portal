import React from "react";
import PropTypes from "prop-types";
import {ChartsContainer, ClaimTabular} from "../index";
import "./Widget.component.scss";

const contentComponentMap = {
  BRANDHORIZONTALBAR: ChartsContainer,
  CLAIMTABULAR: ClaimTabular,
  CLAIMTYPEBAR: ChartsContainer
}

const Widget = props => {
  const {
    tableMeta,
    data,
    fetchComplete,
    widgetCommon: {
      layoutClasses: commonLayoutClasses = "",
      widgetStyle: commonWidgetStyle = {},
    },
    widget: {
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

  const opts = {data, fetchComplete, widgetCommon: props.widgetCommon, widgetStackItem, SUBTYPE, widget: props.widget};
  tableMeta !== undefined && (opts.tableMeta = tableMeta);

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
  data: PropTypes.array,
  fetchComplete: PropTypes.bool,
  tableMeta: PropTypes.object,
  userProfile: PropTypes.object,
  widget: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgetStackItem: PropTypes.object
};

export default Widget;
