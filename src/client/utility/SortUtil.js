import CONSTANTS from "../constants/constants";

export default class SortUtil {
  static sortAndNormalise(header) {
    const columns = [...this.state.columns];
    const columnMeta = columns.find(column => column.accessor === header.id);
    if (columnMeta.canSort !== false) {
      let sortLevel = columnMeta.sortState.level;
      let columnPriority = this.state.columnPriority;
      sortLevel = Number.isNaN(sortLevel) ? CONSTANTS.SORTSTATE.ASCENDING : sortLevel;
      if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) {
        columnMeta.sortState.level = CONSTANTS.SORTSTATE.RESET;
        columnMeta.sortState.priorityLevel = -1;
      } else {
        columnMeta.sortState.level = sortLevel === CONSTANTS.SORTSTATE.RESET ? CONSTANTS.SORTSTATE.ASCENDING : CONSTANTS.SORTSTATE.DESCENDING;
        if (typeof columnMeta.sortState.priorityLevel === "undefined" || columnMeta.sortState.priorityLevel === -1) {
          columnMeta.sortState.priorityLevel = this.state.columnPriority + 1;
          columnPriority += 1;
        }
      }
      this.setState({columns, columnPriority}, () => this.multiSort());
    }
  }
  static multiSort(dataList) {
      const columns = [...this.state.columns];
      const sortingColumns = columns.filter(column => column.sortState.priorityLevel >= 0 ?  column : false);
      sortingColumns.sort((a, b) => {
        return a.sortState.priorityLevel - b.sortState.priorityLevel;
      });
      const unsortedList = dataList ? dataList : this.state.unsortedList;
      try {
        const sortedList = SortUtil.multiSortUtil(unsortedList, sortingColumns, 0);
        let i = 1;
        const columnPriority = sortingColumns.length > 0 ? this.state.columnPriority : 0;
        sortedList.forEach(item => {
          item.sequence = i++;
        });
        this.setState({filteredList: sortedList, columnPriority});
        return sortedList;
      } catch (e) {
        return unsortedList;
      }
  }

  static sortList(unSortedList, columns) {
    const sortLevel = columns.sortState.level;
    const id = columns.accessor;
    const sortType = columns.sortState.type;
    const sortedList = unSortedList;
    if (!columns || columns.length === 0 || !unSortedList || unSortedList.length === 0) {return unSortedList;}
    sortedList.sort((a, b) => {
      if (sortType === CONSTANTS.SORTSTATE.DATETYPE || sortType === CONSTANTS.SORTSTATE.NUMERICTYPE) {
        const aValue = (sortType === CONSTANTS.SORTSTATE.DATETYPE) ? new Date(a[id]) : a[id];
        const bValue = (sortType === CONSTANTS.SORTSTATE.DATETYPE) ? new Date(b[id]) : b[id];
        return SortUtil.sortNumericAndDate(aValue, bValue, sortLevel);
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

  /* eslint-disable max-statements */
  static multiSortUtil(unSortedList, columns, i) {
    let result = [];
    if (i >= columns.length || !unSortedList || unSortedList.length === 0) {return unSortedList;}
    const sortedList  = this.sortList([...unSortedList], columns[i]);
    let initRow = sortedList[0];
    let tempList = [];
    tempList.push(initRow);
    const colName = columns[i].accessor;
    const sortType = columns[i].sortState.type;
    for (let j = 1; j < sortedList.length; j++) {
      let a = initRow[colName];
      let b = sortedList[j][colName];
      if (sortType === CONSTANTS.SORTSTATE.ARRAYTYPE) {
        a = initRow[colName].join(",");
        b = sortedList[j][colName].join(",");
      }
      if (a === b) {
          tempList.push(sortedList[j]);
        } else {
        if (tempList.length > 1) {tempList = this.multiSortUtil(tempList, columns, i + 1);}
        result = result.concat(tempList);
        tempList = [];
        tempList.push(sortedList[j]);
        initRow = sortedList[j];
      }
    }
    if (tempList.length > 1) {tempList = this.multiSortUtil(tempList, columns, i + 1);}
    result = result.concat(tempList);
    return result;
  }

  static sortNumericAndDate (a, b, sortLevel) {
    if (sortLevel === CONSTANTS.SORTSTATE.ASCENDING) return a - b;
    if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) return b - a;
    return 0;
  }

  static sortAlphabet (a, b, sortLevel) {
    if (!a || !b) {
       return 0;
    }
    if (sortLevel === CONSTANTS.SORTSTATE.ASCENDING) {
      if (a.toUpperCase() < b.toUpperCase()) return -1;
      if (a.toUpperCase() > b.toUpperCase()) return 1;
    }
    if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) {
      if (a.toUpperCase() > b.toUpperCase()) return -1;
      if (a.toUpperCase() < b.toUpperCase()) return 1;
    }
    return SortUtil.sortAlphabetWithoutCase(a, b, sortLevel);
  }

  static sortAlphabetWithoutCase (a, b, sortLevel) {
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
