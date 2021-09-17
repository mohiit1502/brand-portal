/* eslint-disable filenames/match-regex, no-unused-expressions, no-magic-numbers */
import React, {memo} from "react";
import PropTypes from "prop-types";
import Widget from "./../Widget";
import "./WidgetContainer.component.scss";

const WidgetContainer = props => {

  const {authConfig, currentFilters, data, fetchComplete, userProfile, widgetCommon, widgets, widgetStack} = props;

  const layoutWidgets = () => {
    const laidoutWidgets = [];
    widgets && widgets.forEach(widget => {
      const placement = widget.PLACEMENT && widget.PLACEMENT.indexOf(".") > -1 ? widget.PLACEMENT.split(".") : [];
      const row = placement[0];
      const order = placement[1];
      const span = placement[2];

      let currentRowArray = laidoutWidgets[row - 1];
      if (!currentRowArray) {
        for (let i = 0; i < row; i++) {
          laidoutWidgets.push([]);
        }
        currentRowArray = laidoutWidgets[row - 1];
      }
      const widgetMeta = {row, order, span, widget};
      currentRowArray.push(widgetMeta);
    });

    laidoutWidgets && laidoutWidgets.forEach(widgetRow => {
      widgetRow.sort((widget1, widget2) => widget1.order > widget2.order);
    });

    return laidoutWidgets && laidoutWidgets.map((widgetRow, key1) => {
      return widgetRow && widgetRow.map((widgetMeta, key2) => {
        const widget = widgetMeta.widget;
        const widgetData = data[widget.DATAMAPPER];
        const widgetStackItem = widgetStack[widget.TYPE];
        const opts = {authConfig, currentFilters, key: `widget-${key1}-${key2}`, data: widgetData, fetchComplete, userProfile, widgetCommon, widgetStackItem, widget};
        widget.DETAILS.colClass = widgetMeta.span ? `col-${widgetMeta.span}` : "";
        return <Widget key={key1} {...opts} />;
      });
    });
  };

  return (
    <div className="c-WidgetContainer row my-4 mx-0 px-4">
      {layoutWidgets()}
    </div>
  );
};

WidgetContainer.propTypes = {
  authConfig: PropTypes.object,
  currentFilters: PropTypes.object,
  data: PropTypes.object,
  fetchComplete: PropTypes.bool,
  userProfile: PropTypes.object,
  widgets: PropTypes.array,
  widgetCommon: PropTypes.object,
  widgetStack: PropTypes.object
};

export default memo(WidgetContainer);
