import React, {memo} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import {dispatchFilter} from "../../actions/dashboard/dashboard-actions";
import Helper from "../../utility/helper";
import "./Summary.component.scss";

const Summary = props => {

  const {
    currentFilters,
    data,
    dispatchFilter,
    fetchComplete,
    history,
    ID,
    toggleModal,
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
    return <ul className="list-unstyled row">
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
          return <li key={key} className={`list-unstyled d-inline-block col-${12/body.items.length}`}>
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
    toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  return (
    <div className={`c-Summary${contentClasses ? " " + contentClasses : ""}${commonWidgetClasses ? " " + commonWidgetClasses : ""}`}>
      <h4 className={headerLayoutClasses}>{header ? header.title : ""}</h4>
      <div className={`Summary-body ${bodyLayoutClasses}`}>
        {getDetails()}
      </div>
      <span className={`${footerLayoutClasses}${footerContentClasses ? " " + footerContentClasses : ""}`} onClick={triggerAddAction}>{footer && footer.text}</span>
    </div>
  );
};

Summary.propTypes = {
  data: PropTypes.object,
  dispatchFilter: PropTypes.func,
  fetchComplete: PropTypes.bool,
  history: PropTypes.array,
  ID: PropTypes.string,
  toggleModal: PropTypes.func,
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
