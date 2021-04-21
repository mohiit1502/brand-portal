
export default class SearchUtil {
    static getFilteredList(dataList, searchText, identifier) {
        // eslint-disable-next-line complexity
        const filteredList = dataList.filter(record => {
            switch (identifier) {
                case "brands": return record.brandName && record.brandName.toLowerCase().indexOf(searchText) !== -1
                || record.dateAdded && record.dateAdded.toLowerCase().indexOf(searchText) !== -1
                || record.brandStatus && record.brandStatus.toLowerCase().indexOf(searchText) !== -1;
                case "claims": return record.caseNumber.toLowerCase().indexOf(searchText) !== -1
                || record.claimType.toLowerCase().indexOf(searchText) !== -1
                || record.brandName.toLowerCase().indexOf(searchText) !== -1
                || record.createdByName.toLowerCase().indexOf(searchText) !== -1
                || record.claimDate.toLowerCase().indexOf(searchText) !== -1
                || record.claimStatus.toLowerCase().indexOf(searchText) !== -1;
                case "users": return record.username.toLowerCase().indexOf(searchText) !== -1
                || record.role.toLowerCase().indexOf(searchText) !== -1
                || record.status.toLowerCase().indexOf(searchText) !== -1
                || record.brands.join(",").toLowerCase().indexOf(searchText) !== -1;
                default: return true;
            }
        });
        return filteredList;
    }
    // eslint-disable-next-line max-statements
    static uiSearch (evt, isFilter, filteredRecords) {
        const identifier = this.state.identifier;
        const searchText = evt ? evt.target.value && evt.target.value.toLowerCase() : this.state.searchText;
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
                i = 1;
                filteredList = this.multiSort(filteredList);
            }
        }
        let i = 1;
        filteredList.forEach(record => record.sequence = i++);
        this.setState({filteredList, unsortedList: filteredList, searchText}, () => {!isFilter && this.applyFilters(true, filteredList);});
    }
}
