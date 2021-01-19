import React from "react";
import PropTypes from "prop-types";
import "./FilterType.component.scss";

const FilterType = props => {

  // const clearFilter = () => {
  //   props.clearFilterHandler({...props.currentFilters, [props.filterId]: ""})
  // }

  const filters = props.filters

  const getFilterText = (filterName, filterOption) => {
    if (filterName === "Submitted By") {
      return filterName + " " + filterOption.name;
    } else if (filterName === "Associated Brands") {
      return "Associated Brand is " + filterOption.name;
    } else {
      return `${filterName} is ${filterOption.name}`;
    }
  }

  return filters.map(filter => {
    const filterId = filter.id;
    const filterName = filter.name
    const filterOptions = filter.filterOptions;
    const selectedFilterOption = filterOptions.filter(option => option.selected)
    if (selectedFilterOption.length > 0) {
      const allSelectedFilterOption = selectedFilterOption.filter(filterOption => filterOption.value === "all");
      if (allSelectedFilterOption.length <= 0) {
        return selectedFilterOption.map(filterOption => (
          <div className="c-FilterType font-size-14 mt-2 mr-1 px-2">
              <span className="c-FilterType__primaryText mr-3 line-height-reset">
                {getFilterText(filterName, filterOption)}
              </span>
            <span className="c-FilterType__closeButton line-height-reset font-size-20" onClick={() => props.clearFilter(filterId,filterOption.id)}>x</span>
          </div>)
        )
      }
    }
  });
};

FilterType.propTypes = {
  clearFilterHandler: PropTypes.func,
  currentFilters: PropTypes.object,
  filterMap: PropTypes.object,
  filterText: PropTypes.string
};

export default FilterType;
