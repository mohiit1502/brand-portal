import CONSTANTS from "../constants/constants";

export default class SortUtil {
  static multiSort() {

   // const unsortedList = this.state.filteredList.length>0 ? [...this.state.filteredList]: [...this.state.unsortedList];
    const columns = [...this.state.columns];
    const sortingColumns = columns.filter(column => {
      if (column.sortState.priorityLevel >= 0)
        return column;
    });
    sortingColumns.sort((a, b) => {
      return a.sortState.priorityLevel - b.sortState.priorityLevel;
    });
    let unsortedList = this.state.unsortedList;
    // if (this.state.appliedFilter.length > 0 || this.state.searchText) {
    //   unsortedList = this.state.filteredList;
    // }
    let sortedList;
    // if (sortingColumns.length <= 0) 
    //     unsortedList = this.state.
    //   if (this.state.appliedFilter.length > 0 || this.state.searchText) {
    //     sortedList = this.state.filteredList;
    //   } else {
    //     sortedList = this.state.unsortedList;
    //   }
    // }  
    // else 
     sortedList = SortUtil.multiSortUtil(unsortedList, sortingColumns, 0);

    this.setState({filteredList: sortedList});
    return sortedList;
  }

  static sortList(unSortedList, sortLevel, id, sortType) { 
    unSortedList.sort((a, b) => {
      if (sortType === CONSTANTS.SORTSTATE.DATETYPE) {
        const aDate = new Date(a[id]);
        const bDate = new Date(b[id]);
        return SortUtil.sortNumericAndDate(aDate, bDate, sortLevel);
      } else if (sortType === CONSTANTS.SORTSTATE.ARRAYTYPE) {
        a = a[id].join(",")
        b = b[id].join(",")
        return SortUtil.sortAlphabet(a, b, sortLevel);
      } else {
        return SortUtil.sortAlphabet(a[id], b[id], sortLevel);
      }
    })
    return unSortedList;
  }

  // static multiSort(header, multiSortingConfigue) { //flag
  //   // if (!sortingConfigue || sortingConfigue.length <= 0) {
  //   //   return unsortedList;
  //   // }
  //   SortUtil.myMultiSort();
  //   if (multiSortingConfigue) {
  //     multiSortingConfigue.sort((a, b) => {
  //       if (a.sortState.initSort && b.sortState.initSort) {
  //         return a.sortState.priorityLevel - b.sortState.priorityLevel;
  //       } else if (!a.sortState.initSort && b.sortState.initSort) {
  //         return 1;
  //       } else if (a.sortState.initSort && !b.sortState.initSort) {
  //         return -1;
  //       }
  //         else return 0;
  //     });
  //     let sortedList = [];
  //     sortedList = SortUtil.multiSortUtil(header, multiSortingConfigue, 0);
  //     return sortedList;
  //   }
  //   else{
  //     let filteredList = [...this.state.filteredList];
  //     const columns = [...this.state.columns];
  //     const columnMeta = columns.find(column => column.accessor === header.id);
  //     let sortLevel = columnMeta.sortState.level;
  //     let sortType = columnMeta.sortState.type;
  //     let i = 1;
  //     sortLevel = Number.isNaN(sortLevel) ? CONSTANTS.SORTSTATE.ASCENDING : sortLevel;
  //     if (sortLevel === CONSTANTS.SORTSTATE.RESET) {
  //       columnMeta.sortState.level = CONSTANTS.SORTSTATE.ASCENDING;
  //       this.state.unsortedList.forEach(item => item.sequence = i++)
  //       this.setState({filteredList: this.state.unsortedList, columns});
  //     }
  //     else {
  //       filteredList = SortUtil.sortList(filteredList, sortLevel,header.id, sortType );
  //       filteredList.forEach(item => item.sequence = i++)
  //       columnMeta.sortState.level = columnMeta.sortState.level === CONSTANTS.SORTSTATE.RESET ? CONSTANTS.SORTSTATE.ASCENDING : columnMeta.sortState.level + 1;
  //       this.setState({filteredList, columns});
  //     }
  //   }
  // }
  static sort(header) {
    const filteredList = [...this.state.filteredList];  //args 
    // const columns = [...this.state.columns];
    // const columnMeta = columns.find(column => column.accessor === header.id);
    // let sortLevel = columnMeta.sortState.level;
    // let sortType = columnMeta.sortState.type;
    // let i = 1;
    // sortLevel = Number.isNaN(sortLevel) ? CONSTANTS.SORTSTATE.ASCENDING : sortLevel;
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
      // filteredList.forEach(item => item.sequence = i++)
      // columnMeta.sortState.level = columnMeta.sortState.level === CONSTANTS.SORTSTATE.RESET ? CONSTANTS.SORTSTATE.ASCENDING : columnMeta.sortState.level + 1;
      // this.setState({filteredList, columns});
    }
  }
  static multiSortUtil(unsortedList, columnConfigue, i) {
    let result = [];
    if(i>=columnConfigue.length)
      return unsortedList;
    let sortedList  = this.sortList(unsortedList, columnConfigue[i].sortState.level, columnConfigue[i].accessor, columnConfigue[i].sortState.type);
    let initRow = sortedList[0];
    let tempList = []; tempList.push(initRow);
    const colName = columnConfigue[i].accessor;
    const sortType = columnConfigue[i].sortState.type;
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
            tempList = this.multiSortUtil(tempList, columnConfigue, i + 1);
        result = result.concat(tempList);
        tempList = []; tempList.push(sortedList[j]);
        initRow = sortedList[j];
      }
    }
    if(tempList.length > 1)
        tempList = this.multiSortUtil(tempList, columnConfigue, i + 1);
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
