import CONSTANTS from "../constants/constants";

export default class SortUtil {
  static multiSort() {
    const columns = [...this.state.columns];
    const sortingColumns = columns.filter(column => {
      if (column.sortState.priorityLevel >= 0)
        return column;
    });
    sortingColumns.sort((a, b) => {
      return a.sortState.priorityLevel - b.sortState.priorityLevel;
    });
    const unsortedList = this.state.unsortedList;
    const sortedList = SortUtil.multiSortUtil(unsortedList, sortingColumns, 0);
    let i = 1;
    sortedList.forEach(item => item.sequence = i++);
    this.setState({filteredList: sortedList});
    return sortedList;
  }

  static sortList(unSortedList, columns) {
    const sortLevel = columns.sortState.level;
    const id = columns.accessor;
    const sortType = columns.sortState.type;
    const sortedList = unSortedList;
    if (!columns || columns.length === 0 || !unSortedList || unSortedList.length === 0)
      return unSortedList;
    sortedList.sort((a, b) => {
      if (sortType === CONSTANTS.SORTSTATE.DATETYPE) {
        const aDate = new Date(a[id]);
        const bDate = new Date(b[id]);
        return SortUtil.sortNumericAndDate(aDate, bDate, sortLevel);
      } else if (sortType === CONSTANTS.SORTSTATE.ARRAYTYPE) {
        a = a[id].join(",");
        b = b[id].join(",");
        return SortUtil.sortAlphabet(a, b, sortLevel);
      } else {
        return SortUtil.sortAlphabet(a[id], b[id], sortLevel);
      }
    });
    return sortedList;
  }

  static multiSortUtil(unSortedList, columns, i) {
    let result = [];
    if(i>=columns.length || !unSortedList || unSortedList.length == 0)
      return unSortedList;
    let sortedList  = this.sortList([...unSortedList], columns[i]);
    let initRow = sortedList[0];
    let tempList = []; 
    tempList.push(initRow);
    const colName = columns[i].accessor;
    const sortType = columns[i].sortState.type;
    for(let j = 1;j < sortedList.length;j++) {
      let a = initRow[colName],b = sortedList[j][colName];
      if (sortType === CONSTANTS.SORTSTATE.ARRAYTYPE) {
        a = initRow[colName].join(",")
        b = sortedList[j][colName].join(",")
      }
      if(a===b) {
          tempList.push(sortedList[j]);
        } else {
        if(tempList.length > 1)
            tempList = this.multiSortUtil(tempList, columns, i + 1);
        result = result.concat(tempList);
        tempList = [];
        tempList.push(sortedList[j]);
        initRow = sortedList[j];
      }
    }
    if(tempList.length > 1)
        tempList = this.multiSortUtil(tempList, columns, i + 1);
    result = result.concat(tempList);
    return result;
  }

  static sortNumericAndDate (a, b, sortLevel) {
    if (sortLevel === CONSTANTS.SORTSTATE.ASCENDING) return a - b;
    if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) return b - a;
    return 0;
  }
  static sortAlphabet (a, b, sortLevel) {
    if (sortLevel === CONSTANTS.SORTSTATE.ASCENDING) {
      if (a < b) return -1;
      if (a > b) return 1;
    }
    if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) {
      if (a < b) return 1;
      if (a > b) return -1;
    }
    return 0;
  }
}
