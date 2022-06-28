/* eslint-disable max-statements, no-return-assign */
import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";

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
                    return filterOptionsSelected.reduce((acc, filterOption) => {
                      return acc || (!!record[filterId] && record[filterId].toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
                    }, false);
                });
            }
        }
        return filteredList;
    }
    static getAppliedFilterIDs (appliedFilters) {
        const filterSelectedByName = [];
        // eslint-disable-next-line no-unused-expressions
        appliedFilters && appliedFilters.map(filter => {
            let res;
            filter.filterOptions.map(item => { res = res || item.selected;});
            if (res) { filterSelectedByName.push(filter.id);}
        });
        return filterSelectedByName;
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
        const mixpanelPayload = {
            APPLIED_FILTER: FilterUtil.getAppliedFilterIDs(appliedFilters),
            WORK_FLOW: MIXPANEL_CONSTANTS.TABLE_LIST_TO_WORKFLOW_MAPPING[identifier] ?  MIXPANEL_CONSTANTS.TABLE_LIST_TO_WORKFLOW_MAPPING[identifier] : "WORK_FLOW_NOT_FOUND"
        };
        if (isSearch) {
            if (this.state.columnPriority > 0) {
                filteredList = this.multiSort(filteredList);
            }
        } else {
            this.toggleFilterVisibility(showFilter);
            if (mixpanelPayload && mixpanelPayload.APPLIED_FILTER.length > 0) {
                mixpanel.trackEvent(MIXPANEL_CONSTANTS.FILTER_EVENTS.APPLY_FILTER, mixpanelPayload);
            }
        }
        let i = 1;
        filteredList.forEach(record => record.sequence = i++);
        /* eslint-disable no-unused-expressions */
        this.setState({filteredList, unsortedList: filteredList}, () => {!isSearch && this.uiSearch(null, true, filteredList);});

    }
}
