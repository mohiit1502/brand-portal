/* eslint-disable no-unused-expressions */
import React, {memo} from "react";
import PropTypes from "prop-types";
import Widget from "./../Widget";
import "./WidgetContainer.component.scss";

const WidgetContainer = props => {

  const {authConfig, data, fetchComplete, tableMeta, userProfile, widgetCommon, widgets, widgetStack} = props;

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
        const widgetData = data[widget.DATAMAPPER]
        const widgetStackItem = widgetStack[widget.TYPE];
        const opts = {key: `${key1}-${key2}`, data: widgetData, fetchComplete, widgetCommon, widgetStackItem, widget}
        widget.DETAILS.colClass = widgetMeta.span ? `col-${widgetMeta.span}` : "";
        widget.TYPE === "CLAIMTABULAR" && (opts.tableMeta = tableMeta.CLAIM)
        return <Widget {...opts} />;
      });
    });
  };

  return (
    <div className="c-WidgetContainer row mb-3 h-100">
      {layoutWidgets()}
    </div>
  );
};

WidgetContainer.propTypes = {
  authConfig: PropTypes.object,
  data: PropTypes.object,
  fetchComplete: PropTypes.bool,
  tableMeta: PropTypes.object,
  userProfile: PropTypes.object,
  widgets: PropTypes.array,
  widgetCommon: PropTypes.object,
  widgetStack: PropTypes.object
};

export default memo(WidgetContainer);
