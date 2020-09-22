/* eslint-disable no-unused-expressions */
import React from "react";
import PropTypes from "prop-types";
import Widget from "./../Widget";
import "./WidgetContainer.component.scss";

const WidgetContainer = props => {

  const {authConfig, restConfig, userProfile, widgetCommon, widgets} = props;

  const layoutWidgets = () => {
    const laidoutWidgets = [];
    widgets && widgets.forEach(widget => {
      const displayWidget = restConfig.AUTHORIZATIONS_ENABLED
        ? userProfile.role.name
          && authConfig[widget.item].SECTION_ACCESS.map(role => role.toLowerCase()).includes(userProfile.role.name && userProfile.role.name.toLowerCase())
        : true;
      if (displayWidget) {
        const placement = widget.placement && widget.placement.indexOf(".") > -1 ? widget.placement.split(".") : [];
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
      }
    });

    laidoutWidgets && laidoutWidgets.forEach(widgetRow => {
      widgetRow.sort((widget1, widget2) => widget1.order > widget2.order);
    });

    return laidoutWidgets && laidoutWidgets.map((widgetRow, key1) => {
      return widgetRow && widgetRow.map((widgetMeta, key2) => {
        const colClass = widgetMeta.span ? `col-${widgetMeta.span}` : "";
        widgetMeta.widget.colClass = colClass;
        return <Widget key={key1 + "-" + key2} authConfig={authConfig} restConfig={restConfig} userProfile={userProfile} widgetCommon={widgetCommon} widget={widgetMeta.widget} />;
      });
    });
  };

  return (
    <div className="c-WidgetContainer row h-100 p-5 mx-5">
      {layoutWidgets()}
    </div>
  );
};

WidgetContainer.propTypes = {
  authConfig: PropTypes.object,
  restConfig: PropTypes.object,
  userProfile: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgets: PropTypes.array
};

export default WidgetContainer;
