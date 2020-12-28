import React from "react";
import PropTypes from "prop-types";
import "./FilterType.component.scss";

const FilterType = props => {

  const clearFilter = () => {
    props.clearFilterHandler({...props.currentFilters, [props.filterId]: ""})
  }

  return (
    <div className="c-FilterType font-size-14 mt-2 mr-1 px-2">
      <span className="c-FilterType__primaryText mr-3 line-height-reset">
        {props.filterText ? props.filterText.replace("__filterType__", props.filterMap[props.currentFilters[props.filterId]]) : ""}
      </span>
      <span className="c-FilterType__closeButton line-height-reset font-size-20" onClick={clearFilter}>x</span>
    </div>
  );
};

FilterType.propTypes = {
  clearFilterHandler: PropTypes.func,
  currentFilters: PropTypes.object,
  filterMap: PropTypes.object,
  filterText: PropTypes.string
};

export default FilterType;
