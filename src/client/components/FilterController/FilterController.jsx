import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dispatchFilter } from "./../../actions/dashboard/dashboard-actions";
import { TOGGLE_ACTIONS, toggleModal } from "../../actions/modal-actions"
import * as images from "../../images";
import "./FilterController.component.scss";
import { showNotification } from "../../actions/notification/notification-actions";
import DateSelector from '../DateSelector';

const FilterController = props => {
  const { dispatchFilter, currentFilters, filters: filterMeta, updateChart, widgetId} = props;
  const [containerState, setContainerState] = useState({
    className: "form-group custom-input-form-group custom-select-form-group dropdown mb-0"
  });
  const [fieldState, setFieldState] = useState({
    dateRange: {
      className: `form-control form-control-filter-controller custom-input-element`,
      dropdownOptions: [
        { id: "last7days", value: "last7days", label: "Last 7 days", handler: onChangeHandler },
        { id: "last30days", value: "last30days", label: "Last 30 Days", handler: onChangeHandler },
        { id: "last60days", value: "last60days", label: "Last 60 days", handler: onChangeHandler },
        { id: "last90days", value: "last90days", label: "Last 90 days", handler: onChangeHandler },
        { id: "alltime", value: "alltime", label: "All time", handler: onChangeHandler },
        { id: "customdate", value: "customdate", label: "Custom Date", handler: dispatchDateSelector }
      ],
      error: "",
      id: "date-filter-controller",
      subTitle: "",
      type: "select",
      value: "Last 30 Days"
    },
    claimType: {
      className: `form-control form-control-filter-controller custom-input-element`,
      dropdownOptions: [
        { id: "all", value: "all", label: "All", handler: onChangeHandler },
        { id: "trademark", value: "trademark", label: "Trademark", handler: onChangeHandler },
        { id: "patent", value: "patent", label: "Patent", handler: onChangeHandler },
        { id: "counterfeit", value: "counterfeit", label: "Counterfeit", handler: onChangeHandler },
        { id: "copyright", value: "copyright", label: "Copyright", handler: onChangeHandler }
      ],
      error: "",
      id: "claim-type-filter-controller",
      subTitle: "",
      type: "select",
      value: "All"
    }
  })

  //serialized function for update chart
  //doesnt send state
  const serializeFunction = updateChart.toString();

  function dispatchDateSelector() {
    console.log("dispatchDateSelector");

    //Pass the org Id
    let currentWidgetFilters = currentFilters[widgetId];
    if (!currentWidgetFilters) {
      currentWidgetFilters = {};
      currentFilters[widgetId] = currentWidgetFilters
    }
    let orgIdValue = currentFilters.orgId;
    const meta = { templateName: "DateSelectorTemplate", orgId: orgIdValue, clickMe: serializeFunction };

    props.toggleModal(TOGGLE_ACTIONS.SHOW, { ...meta });
    console.log("dispatchDateSelector-End");

  }

  function onChangeHandler(option, filter) {
    let currentWidgetFilters = currentFilters[widgetId];
    if (!currentWidgetFilters) {
      currentWidgetFilters = {};
      currentFilters[widgetId] = currentWidgetFilters
    }
    currentWidgetFilters[filter.name] = option.value
    currentWidgetFilters.orgId = currentFilters.orgId;
    updateChart(currentWidgetFilters);
    // dispatchFilter(currentFilters);
  }

  const onClickHandler = (option, filter) => {
    setFieldState(fieldState => {
      const fieldStateCloned = { ...fieldState };
      fieldStateCloned[filter.name].value = option.label;
      return fieldStateCloned;
    })
    option.handler && option.handler(option, filter);
  }

  const filterRenders = filterMeta && filterMeta.map((filter, key1) => {
    let ddOptions = [];
    if (fieldState[filter.name] && fieldState[filter.name].dropdownOptions) {
      if (fieldState[filter.name].dropdownOptions.length === undefined) {
        ddOptions = Object.keys(fieldState[filter.name].dropdownOptions).map((ddSection, key2) => {
          const sectionArray = fieldState[filter.name].dropdownOptions[ddSection];
          return <div key={key1 + " " + key2} className="border-bottom">
            {sectionArray.map((option, i) => <a key={option.id || i} className="dropdown-item" onClick={() => onClickHandler(option, filter)}>{option.label}</a>)}
          </div>
        })
      } else {
        ddOptions = fieldState[filter.name].dropdownOptions.map((option, i) => <a key={key1 + " " + option.id || i} className="dropdown-item" onClick={() => onClickHandler(option, filter)}>
          {option.label}</a>);
      }
    }
    return <div key={key1} className={filter.classes}>
      <div className={`${containerState.className}`}>
        <input type={fieldState[filter.name] && fieldState[filter.name].type} className={fieldState[filter.name] && fieldState[filter.name].className}
          id={fieldState[filter.name] && fieldState[filter.name].id} value={fieldState[filter.name].value} onChange={() => { }}
          data-toggle="dropdown" autoComplete="off" />
        <label className={`custom-input-label${!fieldState[filter.name].value ? " custom-input-label-placeholder" : ""}`} htmlFor="claim-type-widget-filter-controller">
          <div className="label-lower-bg position-absolute w-100 h-50 d-block" />
          <span className="label-text"> {filter.placeholder} </span>
        </label>
        <img src={images.ArrowDown} alt="image-arrow-down" className="dropdown-arrow" />
        <div className="dropdown-menu">{ddOptions}</div>
      </div>
    </div>
  });

  return (
    <div className="c-FilterController row">
      {filterRenders}
    </div>
  );
};

FilterController.propTypes = {
  currentFilters: PropTypes.object,
  dispatchFilter: PropTypes.func,
  updateChart: PropTypes.func,
  widgetId: PropTypes.string
};

const mapDispatchToProps = {
  dispatchFilter,
  toggleModal
}

export default memo(connect(null, mapDispatchToProps)(FilterController));
