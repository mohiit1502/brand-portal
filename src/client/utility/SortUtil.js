import CONSTANTS from "../constants/constants";

export default class SortUtil {
  static sort(header) {
    const filteredList = [...this.state.filteredList];
    const columns = [...this.state.columns];
    const columnMeta = columns.find(column => column.accessor === header.id);
    let sortLevel = columnMeta.sortState.level;
    let sortType = columnMeta.sortState.type;
    let i = 1;
    sortLevel = Number.isNaN(sortLevel) ? CONSTANTS.SORTSTATE.ASCENDING : sortLevel;
    if (sortLevel === CONSTANTS.SORTSTATE.RESET) {
      columnMeta.sortState.level = CONSTANTS.SORTSTATE.ASCENDING;
      this.state.unsortedList.forEach(item => item.sequence = i++)
      this.setState({filteredList: this.state.unsortedList, columns});
    } else {
      filteredList.sort((a, b) => {
        if (sortType === CONSTANTS.SORTSTATE.DATETYPE) {
          const aDate = new Date(a[header.id]);
          const bDate = new Date(b[header.id]);
          return SortUtil.sortNumericAndDate(aDate, bDate, sortLevel);
        } else if (sortType === CONSTANTS.SORTSTATE.ARRAYTYPE) {
          a = a[header.id].join(",")
          b = b[header.id].join(",")
          return SortUtil.sortAlphabet(a, b, sortLevel);
        } else {
          return SortUtil.sortAlphabet(a[header.id], b[header.id], sortLevel);
        }
      })
      filteredList.forEach(item => item.sequence = i++)
      columnMeta.sortState.level = columnMeta.sortState.level === CONSTANTS.SORTSTATE.RESET ? CONSTANTS.SORTSTATE.ASCENDING : columnMeta.sortState.level + 1;
      this.setState({filteredList, columns});
    }
  }
  static multisort(unsortedList, sortingConfigue) {
    if (!sortingConfigue && sortingConfigue.length <= 0) {
      return unsortedList;
    }
    unsortedList.sort((a, b) => {
      for (let i = 0; i < sortingConfigue.length; i++) {
        let priorityKey = sortingConfigue[i].name;
        let priorityValue = a[priorityKey];
        let level = sortingConfigue[i].level;
        let sortType;
        if (isNaN(priorityValue) && !isNaN(Date.parse(priorityValue)))
          sortType = CONSTANTS.SORTSTATE.DATETYPE;
        else if (priorityValue instanceof Array)
          sortType = CONSTANTS.SORTSTATE.ARRAYTYPE;
        let result;
        if (sortType === CONSTANTS.SORTSTATE.DATETYPE) {
          const aDate = new Date(a[priorityKey]);
          const bDate = new Date(b[priorityKey]);
          result = SortUtil.sortNumericAndDate(aDate, bDate, level);
        } else if (sortType === CONSTANTS.SORTSTATE.ARRAYTYPE) {
          a = a[priorityKey].join(",")
          b = b[priorityKey].join(",")
          result = SortUtil.sortAlphabet(a, b, level);
        } else {
          result = SortUtil.sortAlphabet(a[priorityKey], b[priorityKey], level);
        }
        if (result != 0)
          return result;
      }
      return false;
    });
    return unsortedList;
  }

  static sortNumericAndDate (a, b, sortLevel) {
    if (sortLevel === CONSTANTS.SORTSTATE.ASCENDING) return a - b;
    if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) return b - a;
    return 0;
  }

  static sortAlphabet (a, b, sortLevel) {
    if (sortLevel === CONSTANTS.SORTSTATE.ASCENDING) {
      if (a.toUpperCase() < b.toUpperCase()) return -1;
      if (a.toUpperCase() > b.toUpperCase()) return 1;
    }
    if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) {
      if (a.toUpperCase() > b.toUpperCase()) return -1;
      if (a.toUpperCase() < b.toUpperCase()) return 1;
    }
    return 0;
  }
}
