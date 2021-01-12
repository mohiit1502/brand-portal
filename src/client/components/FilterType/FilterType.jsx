import React from "react";
import PropTypes from "prop-types";
import "./FilterType.component.scss";

const FilterType = props => {

  // const clearFilter = () => {
  //   props.clearFilterHandler({...props.currentFilters, [props.filterId]: ""})
  // }

  const filters = props.filters
  const getFilterPins =() => {
    return (
      filters.map(filter => {
        const filterId = filter.id;
        const filterName = filter.name
        const filterOptions = filter.filterOptions;
        const selectedFilterOption = filterOptions.filter(option => option.selected)
        if(selectedFilterOption.length > 0) {
          const allSelectedFilterOption = selectedFilterOption.filter(filterOption => filterOption.value === "all");
          if(allSelectedFilterOption.length > 0){
            return (
              <div className="c-FilterType font-size-14 mt-2 mr-1 px-2">
                <span className="c-FilterType__primaryText mr-3 line-height-reset">
                  {`${filterName} is All`}
                </span>
                <span className="c-FilterType__closeButton line-height-reset font-size-20" onClick={() => props.clearFilter(filterId,allSelectedFilterOption[0].id)}>x</span>
              </div>
            )
          }else{
            return (selectedFilterOption.map(filterOption => {
              return (
                <div className="c-FilterType font-size-14 mt-2 mr-1 px-2">
                <span className="c-FilterType__primaryText mr-3 line-height-reset">
                  {`${filterName} is ${filterOption.name}`}
                </span>
                  <span className="c-FilterType__closeButton line-height-reset font-size-20" onClick={() => props.clearFilter(filterId,filterOption.id)}>x</span>
                </div>
              )
            }))
          }
        }

      })
    )
  }

  return (
    getFilterPins()
  );
};

FilterType.propTypes = {
  clearFilterHandler: PropTypes.func,
  currentFilters: PropTypes.object,
  filterMap: PropTypes.object,
  filterText: PropTypes.string
};

export default FilterType;
