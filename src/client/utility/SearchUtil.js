import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";
import Helper from "./helper";
import CONSTANTS from "../constants/constants";

export default class SearchUtil {
    static  mixpanelSearchEventhandler = Helper.debounce(mixpanel.trackEvent, CONSTANTS.APIDEBOUNCETIMEOUT);
    static getFilteredList(dataList, searchText, identifier) {
        // eslint-disable-next-line complexity
        return dataList.filter(record => {
            switch (identifier) {
                case "brands": return record.brandName && record.brandName.toLowerCase().indexOf(searchText) !== -1
                || record.dateAdded && record.dateAdded.toLowerCase().indexOf(searchText) !== -1
                || record.trademarkStatus && record.trademarkStatus.toLowerCase().indexOf(searchText) !== -1
                || record.trademarkDescription && record.trademarkDescription.toLowerCase().indexOf(searchText) !== -1
                || record.trademarkNumber && record.trademarkNumber.toLowerCase().indexOf(searchText) !== -1
                || record.trademarkDetailsList && record.trademarkDetailsList.some(tm => {
                    return tm.dateAdded && tm.dateAdded.toLowerCase().indexOf(searchText) !== -1
                    || tm.trademarkStatus && tm.trademarkStatus.toLowerCase().indexOf(searchText) !== -1
                    || tm.trademarkDescription && tm.trademarkDescription.toLowerCase().indexOf(searchText) !== -1
                    || tm.trademarkNumber && tm.trademarkNumber.toLowerCase().indexOf(searchText) !== -1
                  });
                case "claims": return record.caseNumber.toLowerCase().indexOf(searchText) !== -1
                || record.claimType.toLowerCase().indexOf(searchText) !== -1
                || record.brandName.toLowerCase().indexOf(searchText) !== -1
                || record.createdByName.toLowerCase().indexOf(searchText) !== -1
                || record.claimDate.toLowerCase().indexOf(searchText) !== -1
                || record.claimStatus.toLowerCase().indexOf(searchText) !== -1;
                case "users": return record.username && record.username.toLowerCase().indexOf(searchText) !== -1
                || record.role.toLowerCase && record.role.toLowerCase().indexOf(searchText) !== -1
                || record.status.toLowerCase().indexOf(searchText) !== -1
                || record.brands.join(",").toLowerCase().indexOf(searchText) !== -1;
                default: return true;
            }
        });
    }
    // eslint-disable-next-line max-statements
    static uiSearch (evt, isFilter, filteredRecords) {
        const identifier = this.state.identifier;
        const mixpanelPayload = {
            WORK_FLOW: MIXPANEL_CONSTANTS.TABLE_LIST_TO_WORKFLOW_MAPPING[identifier] ?  MIXPANEL_CONSTANTS.TABLE_LIST_TO_WORKFLOW_MAPPING[identifier] : "WORK_FLOW_NOT_FOUND"
        };
        const searchText = evt ? evt.target.value && evt.target.value.toLowerCase() : this.state.searchText ? this.state.searchText.toLowerCase() : "";
        let allRecords;
        if (filteredRecords) {
            allRecords = filteredRecords;
        } else if (identifier === "brands") {
            allRecords = this.state.brandList;
        } else if (identifier === "claims") {
            allRecords = this.props.claims;
        } else if (identifier === "users") {
            allRecords = this.state.userList;
        }
        let filteredList = SearchUtil.getFilteredList(allRecords, searchText, identifier);
        if (isFilter) {
            if (this.state.columnPriority > 0) {
                filteredList = this.multiSort(filteredList);
            }
        } else {
            SearchUtil.mixpanelSearchEventhandler(MIXPANEL_CONSTANTS.SEARCH_EVENT.APPLY_SEARCH, mixpanelPayload);
        }
        let i = 1;
        filteredList.forEach(record => {record.sequence = i++;});
        /* eslint-disable no-unused-expressions */
        this.setState({filteredList, unsortedList: filteredList, searchText}, () => {!isFilter && this.applyFilters(true, filteredList);});
    }
}
