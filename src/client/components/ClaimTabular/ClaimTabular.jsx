/* eslint-disable filenames/match-regex, no-unused-expressions */
import React, {memo, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {dispatchWidgetAction} from "./../../actions/dashboard/dashboard-actions";
import "./ClaimTabular.component.scss";
import {MemoizedTable} from "../index";

const ClaimTabular = props => {
  const statusMap = {"work in progress": "open", submitted: "submitted", closed: "closed"};
  const [state, setState] = useState({
    claimCount: {
      open: 0,
      closed: 0,
      submitted: 0
    },
    selectedTab: "open"
  });
  const {
    fetchComplete,
    tableMeta,
    widgetActionDispatcher,
    widgetCommon: {widgetClasses: commonWidgetClasses = "", footer: commonFooter = {}},
    widget: {DETAILS: {footer = {}, widgetClasses = ""}},
    widgetStackItem
  } = props;
  const classColMap = {
    caseNumber: "col-2",
    claimType: "col-2",
    brandName: "col-3",
    createdByName: "col-3",
    claimDate: "col-2"
  };
  const data = props.data && props.data.filter(item => statusMap[item.claimStatus.toLowerCase()] === state.selectedTab.toLowerCase());
  const opts = {classColMap, columns: tableMeta.columns, data, fetchComplete};

  useEffect(() => {
    const stateCloned = {...state};
    const claimCountClone = {...stateCloned.claimCount};
    stateCloned.claimCount = claimCountClone;
    props.data && props.data.forEach(item => {
      item.createdByName = `${item.firstName  } ${  item.lastName}`;
      const iteratedItemStatus = statusMap[item.claimStatus.toLowerCase()];
      claimCountClone[iteratedItemStatus]++;
    });
    setState(stateCloned);
  }, [props.data]);


  const renderTabs = (
    <div className="tab-bar clearfix">
      <ul className={widgetStackItem.tabContainerClasses}>
        {
          widgetStackItem && widgetStackItem.tabs && widgetStackItem.tabs.map(tab => {
            return (<li key={tab.id} id={tab.id} className={`${widgetStackItem.tabClasses}${tab.id === state.selectedTab ? " active" : ""}`} onClick={() => setState({...state, selectedTab: tab.id})}>
              <p className="item-label">{tab.label}</p>
              <p className="item-count">{state.claimCount[tab.id]}</p>
            </li>);
          })
        }
      </ul>
    </div>
  );

  const commonWidgetClassesInferred = `${commonWidgetClasses ? ` ${commonWidgetClasses}` : ""}`;
  const widgetClassesInferred = `${widgetClasses ? ` ${widgetClasses}` : ""}`;

  const commonFooterLayoutInferred = `${commonFooter.contentLayout ? ` ${commonFooter.contentLayout}` : ""}`;
  const footerLayoutInferred = `${footer.contentLayout ? ` ${footer.contentLayout}` : ""}`;
  const commonFooterContentClassesInferred = `${commonFooter.contentClasses ? ` ${commonFooter.contentClasses}` : ""}`;
  const footerContentClassesInferred = `${footer.contentClasses ? ` ${footer.contentClasses}` : ""}`;

  return (
    <div className={`c-ClaimTabular c-Widget__content${commonWidgetClassesInferred}${widgetClassesInferred}`}>
      {renderTabs}
      <MemoizedTable {...opts} />
      {footer && <div className={`c-Widget__content__footer${commonFooterLayoutInferred}${footerLayoutInferred}`}>
        <Link className={`${commonFooterContentClassesInferred}${footerContentClassesInferred}`} to={footer.href} onClick={() => widgetActionDispatcher(true)}>
          <div className="c-Widget__content__footer__text">
            {footer.text}
          </div>
        </Link>
      </div>}
    </div>
  );
};

ClaimTabular.propTypes = {
  tableMeta: PropTypes.object,
  data: PropTypes.array,
  fetchComplete: PropTypes.bool,
  widget: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgetActionDispatcher: PropTypes.func,
  widgetStackItem: PropTypes.object
};
const mapDispatchToProps = {
  widgetActionDispatcher: dispatchWidgetAction
};

export default memo(connect(null, mapDispatchToProps)(ClaimTabular));
