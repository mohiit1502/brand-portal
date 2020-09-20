/* eslint-disable filenames/match-regex */
/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, {useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {dispatchWidgetAction} from "./../../actions/dashboard/dashboard-actions";
import "./Widget.component.scss";

const Widget = props => {

  const {
  authConfig,
  widgetActionDispatcher,
  restConfig,
    widgetCommon: {
      layoutClasses: commonLayoutClasses = "",
      widgetClasses: commonWidgetClasses = "",
      widgetStyle: commonWidgetStyle = {},
      contentLayout: commonContentLayout = "",
      header: commonHeader = {},
      body: commonBody = {},
      footer: commonFooter = {}
    },
    widget: {actionEnabler = "", colClass = "", item = "", action = "", layoutClasses = "", widgetClasses = "", widgetStyle = {}, header = {}, body = {}, footer = {}},
    userProfile
  } = props;

  const [hovered, setHovered] = useState(false);

  const authRoles = userProfile.role && authConfig[item] && authConfig[item][action] ? authConfig[item][action].length ? authConfig[item][action] : Object.keys(authConfig[item][action]) : [];
  window[actionEnabler] = restConfig.AUTHORIZATIONS_ENABLED ? authRoles && authRoles.length > 0 && userProfile.role.name && authRoles.map(role => role.toLowerCase()).includes(userProfile.role.name && userProfile.role.name.toLowerCase()) : true;
  const isDisabled = actionEnabler && !window[actionEnabler];

  const commonLayoutClassesInferred = `${commonLayoutClasses ? ` ${commonLayoutClasses}` : ""}`;
  const layoutClassesInferred = `${layoutClasses ? ` ${layoutClasses}` : ""}`;
  const colClassInferred = `${colClass ? ` ${colClass}` : ""}`;

  const commonWidgetClassesInferred = `${commonWidgetClasses ? ` ${commonWidgetClasses}` : ""}`;
  const widgetClassesInferred = `${widgetClasses ? ` ${widgetClasses}` : ""}`;

  const commonContentLayoutInferred = `${commonContentLayout ? ` ${commonContentLayout}` : ""}`;

  const commonHeaderLayoutInferred = `${commonHeader.contentLayout ? ` ${commonHeader.contentLayout}` : ""}`;
  const headerLayoutInferred = `${header.contentLayout ? ` ${header.contentLayout}` : ""}`;
  const commonHeaderContentClassesInferred = `${commonHeader.contentClasses ? ` ${commonHeader.contentClasses}` : ""}`;
  const headerContentClassesInferred = `${header.contentClasses ? ` ${header.contentClasses}` : ""}`;

  const commonBodyLayoutInferred = `${commonBody.contentLayout ? ` ${commonBody.contentLayout}` : ""}`;
  const bodyLayoutInferred = `${body.contentLayout ? ` ${body.contentLayout}` : ""}`;
  const commonBodyContentClassesInferred = `${commonBody.contentClasses ? ` ${commonBody.contentClasses}` : ""}`;
  const bodyContentClassesInferred = `${body.contentClasses ? ` ${body.contentClasses}` : ""}`;

  const commonFooterLayoutInferred = `${commonFooter.contentLayout ? ` ${commonFooter.contentLayout}` : ""}`;
  const footerLayoutInferred = `${footer.contentLayout ? ` ${footer.contentLayout}` : ""}`;
  const commonFooterContentClassesInferred = `${commonFooter.contentClasses ? ` ${commonFooter.contentClasses}` : ""}`;
  const footerContentClassesInferred = `${footer.contentClasses ? ` ${footer.contentClasses}` : ""}`;

  return (
    <div className={`c-Widget${commonLayoutClassesInferred}${layoutClassesInferred}${colClassInferred}`} style={{...commonWidgetStyle, ...widgetStyle}}>
      <div className={`c-Widget__content${commonWidgetClassesInferred}${widgetClassesInferred}`}>
        <div className={`c-Widget__content__header${commonContentLayoutInferred}${commonHeaderLayoutInferred}${headerLayoutInferred}`}>
          <div className={`${commonHeaderContentClassesInferred}${headerContentClassesInferred}`}>
            {header.title}
          </div>
        </div>
        <div className={`c-Widget__content__body${commonContentLayoutInferred}${commonBodyLayoutInferred}${bodyLayoutInferred}`}>
          <div className={`${commonBodyContentClassesInferred}${bodyContentClassesInferred}`}>
            {body.content}
          </div>
        </div>
        <div className={`c-Widget__content__footer${commonContentLayoutInferred}${commonFooterLayoutInferred}${footerLayoutInferred}`}>
          <Link className={`${commonFooterContentClassesInferred}${footerContentClassesInferred}${hovered ? " visible" : ""}${isDisabled ? " disabled insufficiet-access-message" : ""}`} to={footer.href} onClick={() => widgetActionDispatcher(true)} onMouseOver={() => isDisabled && setHovered(true)} onMouseOut={() => isDisabled && setHovered(false)}>
            <div className="c-Widget__content__footer__text">
              {footer.text}
              <span className="c-Widget__content__footer__icon"><span className="arrow right" /></span>
            </div>
            {/* {isDisabled && hovered && <div id="widgetActionDisabledTooltip" className="tooltip1 tooltiptext">Insufficient access to perform this action!</div>} */}
          </Link>
        </div>
      </div>
    </div>
  );
};

Widget.propTypes = {
  authConfig: PropTypes.object,
  widgetActionDispatcher: PropTypes.func,
  restConfig: PropTypes.object,
  userProfile: PropTypes.object,
  widgetCommon: PropTypes.object,
  widget: PropTypes.object
};

const mapDispatchToProps = {
  widgetActionDispatcher: dispatchWidgetAction
};

export default connect(null, mapDispatchToProps)(Widget);
