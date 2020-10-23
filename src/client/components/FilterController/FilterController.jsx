import React, {memo, useState} from "react";
import PropTypes from "prop-types";
import "./FilterController.component.scss";
import * as images from "../../images";

const FilterController = props => {
  const [containerState, setContainerState] = useState({
    className: "form-group custom-input-form-group custom-select-form-group dropdown"
  });
  const [fieldState, setFieldState] = useState({
    className: `form-control form-control-filter-controller custom-input-element`,
    dropdownOptions: {
      weekWise: [
        {id: "yesterday", value: "yesterday", label: "Yesterday"},
        {id: "lastweek", value: "lastweek", label: "Last Week"},
        {id: "weektodate", value: "weektodate", label: "Week to Date"}
      ],
      monthWise: [
        {id: "monthtodate", value: "monthtodate", label: "Month to Date"},
        {id: "lastmonth", value: "lastmonth", label: "Last Month"}
      ],
      quarterWise: [
        {id: "quartertodate", value: "quartertodate", label: "Quarter to Date"},
        {id: "lastquarter", value: "lastquarter", label: "Last Quarter"}
      ],
      yearWise: [
        {id: "yeartodate", value: "yeartodate", label: "Year to Date"},
        {id: "lastyear", value: "lastyear", label: "Last Year"},
        {id: "alltime", value: "alltime", label: "All time"}
      ],
      custom: [
        {id: "customdate", value: "customdate", label: "Custom Date", handler: dispatchDateSelector}
      ]
    },
    error: "",
    id: "claim-type-widget-filter-controller",
    subTitle: "",
    type: "select",
    value: ""
  })

  const dispatchDateSelector = () => {

  }

  const updateChart = () => {

  }

  return (
    <div className="c-FilterController">
      <div className={containerState.className}>
        <input type={fieldState.type} className={fieldState.className} id={fieldState.id} value={fieldState.value ? fieldState.value : "All Time"} onChange={updateChart}
               data-toggle="dropdown" autoComplete="off" />
        <label className="custom-input-label custom-input-label-placeholder" htmlFor="claim-type-widget-filter-controller">
          {/*<div className="label-upper-bg position-absolute w-100 h-50 d-block"/>*/}
          <div className="label-lower-bg position-absolute w-100 h-50 d-block"/>
          <span className="label-text"> Time range </span>
        </label>
        <img src={images.ArrowDown} alt="image-arrow-down" className="dropdown-arrow"/>
        <div className="dropdown-menu">
          {Object.keys(fieldState.dropdownOptions).map(ddSection => {
            const sectionArray = fieldState.dropdownOptions[ddSection];
            return <div className="border-bottom">
              {sectionArray.map((option, i) => <a key={option.id || i} className="dropdown-item" onClick={option.handler ? option.handler : () => setFieldState({...fieldState, value: option.label})}>{option.label}</a>)}
            </div>
          })}
        </div>
      </div>
    </div>
  );
};

FilterController.propTypes = {

};

export default memo(FilterController);
