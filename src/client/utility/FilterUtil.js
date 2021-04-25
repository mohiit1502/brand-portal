/* eslint-disable max-statements */
/* eslint-disable no-return-assign */
export default class FilterUtil {

    static applyFiltersUtil(filter, filteredList) {
        const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");
        if (filterOptionsSelected.length) {
            const filterId = filter.id;
            if (filterId === "brands") {
                filteredList = filteredList.filter(record => {
                    let bool = false;
                    filterOptionsSelected.map(filterOption => {
                    record[filterId].map(brand => bool = bool || brand.toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
                    });
                    return bool;
                });
            } else {
            filteredList = filteredList.filter(record => {
                let bool = false;
                filterOptionsSelected.map(filterOption => {
                bool = bool || (!!record[filterId] && record[filterId].toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
                });
                return bool;
            });
            }
        }
        return filteredList;
    }

    // eslint-disable-next-line max-params
    static applyFilters(isSearch, filteredList, showFilter, buttonClickAction) {
        const identifier = this.state.identifier;
        if (filteredList) {
            filteredList = [...filteredList];
        } else if (identifier === "brands") {
            filteredList = [...this.state.brandList];
        } else if (identifier === "claims") {
            filteredList = [...this.props.claims];
        } else if (identifier === "users") {
            filteredList = [...this.state.userList];
        }
        this.state.filters.map(filter => {
            filteredList = FilterUtil.applyFiltersUtil(filter, filteredList);
        });

        const appliedFilters = this.state.filters.map(filter => {
            const clonedFilterOption = filter.filterOptions.map(option => {
                return {...option};
            });
            return {...filter, filterOptions: clonedFilterOption};
        });
        if (buttonClickAction === true) {
            this.setState({appliedFilter: appliedFilters});
        }

        if (isSearch) {
            if (this.state.columnPriority > 0) {
                filteredList = this.multiSort(filteredList);
            }
        } else {
            this.toggleFilterVisibility(showFilter);
        }
        let i = 1;
        filteredList.forEach(record => record.sequence = i++);
        this.setState({filteredList, unsortedList: filteredList}, () => {!isSearch && this.uiSearch(null, true, filteredList);});

    }
}
