import React, {memo} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import {dispatchFilter} from "../../actions/dashboard/dashboard-actions";
import Helper from "../../utility/helper";
import "./Summary.component.scss";
import AuthUtil from "../../utility/AuthUtil";
import mixpanel from "../../utility/mixpanelutils";

const Summary = props => {

  const {
    currentFilters,
    data,
    dispatchFilter,
    fetchComplete,
    history,
    ID,
    toggleModal,
    userProfile,
    widget: {
      DETAILS: {
        body,
        footer,
        header,
        templateName
      },
    },
    widgetCommon: {widgetClasses: commonWidgetClasses = ""},
    widgetStackItem: {
      contentClasses,
      header: {
        layoutClasses: headerLayoutClasses = "",
      },
      body: {
        layoutClasses: bodyLayoutClasses = "",
      },
      footer: {
        layoutClasses: footerLayoutClasses = "",
        contentClasses: footerContentClasses = ""
      }
    }
  } = props;

  const onClickHandler = (filterName) => {
    currentFilters[ID] = filterName;
    dispatchFilter(currentFilters).then(() => history.push(body.href));
  }

  const getDetails = () => {
    return <ul className="list-unstyled d-flex justify-content-between">
      {
        body && body.items && body.items.map((item, key) => {
          let itemCount = "-";
          if (item.mapper === "totalItemsFetched") {
            itemCount = data && data.totalItemsFetched > 0 ? data.totalItemsFetched.toString() : "-";
          } else {
            if (item.value) {
              if (item.value.indexOf(",") > -1) {
                const itemsInPayload = item.value.split(",").map(selector => Helper.search(item.mapper, data, selector)).filter(item => item);
                itemCount = itemsInPayload && itemsInPayload.length > 0 ? itemsInPayload.reduce((total, itemInPayload) => total + itemInPayload.count, 0) : 0;
                itemCount = itemCount > 0 ? itemCount.toString() : "-"
              } else {
                const itemInPayload = Helper.search(item.mapper, data, item.value);
                itemCount = itemInPayload && itemInPayload.count > 0 ? itemInPayload.count.toString() : "-"
              }
            } else {
              itemCount = "-"
            }
          }
          return <li key={key} className={`list-unstyled d-inline-block`}>
            <div className="font-size-12 pb-625 item-status">{item.label}</div>
            {fetchComplete ? itemCount !== "-"
              ? <span onClick={() => onClickHandler(item.name)} className="font-size-28 item-count">{itemCount}</span>
              // ? <Link to={body.href} onClick={onClickHandler} className="font-size-28 item-count">{itemCount}</Link>
              : <span className="font-size-28">{itemCount}</span> : <div className="item-loader" />}
          </li>
        })
      }
    </ul>
  }

  const triggerAddAction = () => {
    const meta = { templateName };
    const mixpanelPayload = { WORK_FLOW: "MY_DASHBOARD"};
    mixpanel.addNewTemplate(meta, mixpanelPayload);
    toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  return (
    <div className={`c-Summary c-Widget__content${contentClasses ? " " + contentClasses : ""}${commonWidgetClasses ? " " + commonWidgetClasses : ""}`}>
      <h4 className={headerLayoutClasses}>{header ? header.title : ""}</h4>
      <div className={`Summary-body ${bodyLayoutClasses}`}>
        {getDetails()}
      </div>
      <footer className={`c-Widget__content__footer${footerLayoutClasses ? " " + footerLayoutClasses : ""}${footerContentClasses ? " " + footerContentClasses : ""}${AuthUtil.isActionAccessible(footer.actionMapper, userProfile) ? "" : " disabled"}`} onClick={triggerAddAction}>{footer && footer.text}</footer>
    </div>
  );
};

Summary.propTypes = {
  data: PropTypes.object,
  dispatchFilter: PropTypes.func,
  fetchComplete: PropTypes.bool,
  history: PropTypes.object,
  ID: PropTypes.string,
  toggleModal: PropTypes.func,
  userProfile: PropTypes.object,
  widget: PropTypes.object,
  widgetCommon: PropTypes.object,
  widgetStackItem: PropTypes.object
};

const mapDispatchToProps = {
  dispatchFilter,
  toggleModal
}

const mapStateToProps = state => {
  return {currentFilters: state.dashboard.filter}
}

export default memo(withRouter(connect(mapStateToProps, mapDispatchToProps)(Summary)));
