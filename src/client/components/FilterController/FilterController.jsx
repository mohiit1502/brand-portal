import React, {memo, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dispatchFilter } from "./../../actions/dashboard/dashboard-actions";
import { TOGGLE_ACTIONS, toggleModal } from "../../actions/modal-actions"
import * as images from "../../images";
import "./FilterController.component.scss";
import { showNotification } from "../../actions/notification/notification-actions";
import DateSelector from '../DateSelector';
import Helper from "../../utility/helper";

const FilterController = props => {
  const { dispatchFilter, currentFilters, filters: filterMeta, updateChartMeta, widgetId} = props;
  const [containerState, setContainerState] = useState({
    className: "form-group custom-input-form-group custom-select-form-group dropdown mb-0"
  });
  const [fieldState, setFieldState] = useState({
    dateRange: {
      className: `form-control form-control-filter-controller custom-input-element`,
      dropdownOptions: {
        weekWise: [
          { id: "yesterday", value: "yesterday", label: "Yesterday", handler: onChangeHandler },
          { id: "lastweek", value: "lastweek", label: "Last Week", handler: onChangeHandler },
          { id: "weektodate", value: "weektodate", label: "Week to Date", handler: onChangeHandler }
        ],
        monthWise: [
          { id: "monthtodate", value: "monthtodate", label: "Month to Date", handler: onChangeHandler },
          { id: "lastmonth", value: "lastmonth", label: "Last 30 Days", handler: onChangeHandler }
        ],
        quarterWise: [
          { id: "quartertodate", value: "quartertodate", label: "Quarter to Date", handler: onChangeHandler },
          { id: "lastquarter", value: "lastquarter", label: "Last Quarter", handler: onChangeHandler }
        ],
        yearWise: [
          { id: "yeartodate", value: "yeartodate", label: "Year to Date", handler: onChangeHandler },
          { id: "lastyear", value: "lastyear", label: "Last Year", handler: onChangeHandler },
          { id: "alltime", value: "alltime", label: "All time", handler: onChangeHandler }
        ],
        custom: [
          { id: "customdate", value: "customdate", label: "Custom Date", handler: dispatchDateSelector }
        ]
      },
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

  useEffect(() => {
    const fieldStateCloned = {...fieldState};
    fieldStateCloned.dateRange.value =  currentFilters[widgetId] && currentFilters[widgetId].value ? currentFilters[widgetId].viewValue : fieldStateCloned.dateRange.value;
    setFieldState(fieldStateCloned);
  }, [currentFilters[widgetId]])

  //serialized function for update chart
  //doesnt send state
  // const serializeFunction = updateChart.toString();

  function dispatchDateSelector() {
    // //Pass the org Id
    // let currentWidgetFilters = currentFilters[widgetId];
    // if (!currentWidgetFilters) {
    //   currentWidgetFilters = {};
    //   currentFilters[widgetId] = currentWidgetFilters
    // }
    // let orgIdValue = currentFilters.orgId;
    const meta = { templateName: "DateSelectorTemplate", updateChartMeta: {...updateChartMeta, filters: filterMeta}, orgId: currentFilters.orgId, currentFilters, widgetId };

    props.toggleModal(TOGGLE_ACTIONS.SHOW, { ...meta });
  }

  function onChangeHandler(option, filter) {
    const currentFiltersCloned = {...currentFilters};
    let currentWidgetFilters = {...currentFiltersCloned[widgetId]};
    if (!currentWidgetFilters) {
      currentWidgetFilters = {};
      currentFiltersCloned[widgetId] = currentWidgetFilters
    } else {
      currentFiltersCloned[widgetId] = currentWidgetFilters;
    }
    currentWidgetFilters[filter.name] = option.value
    currentWidgetFilters.orgId = currentFiltersCloned.orgId;
    Helper.updateChart(currentWidgetFilters, {...updateChartMeta, filters: filterMeta} );
    dispatchFilter(currentFiltersCloned);
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
  updateChartMeta: PropTypes.object,
  widgetId: PropTypes.string
};

const mapDispatchToProps = {
  dispatchFilter,
  toggleModal
}

export default memo(connect(null, mapDispatchToProps)(FilterController));
