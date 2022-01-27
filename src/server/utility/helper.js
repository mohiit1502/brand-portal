/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-expressions */

export default class Helper {

    static getDateRange(dateKey) {
      const date = new Date();
      console.log("Date",date.getTime())
      const dateInMonth = date.getDate();
      console.log("Date",date)
      console.log("Date in month",dateInMonth)
      let fromDate;
      let toDate;
      if (dateKey.includes("-to-")) {
        const parts = dateKey.split("-to-");
        fromDate = parts[0];
        toDate = parts[1];
        return {fromDate, toDate};
      }
      switch (dateKey) {
        case "last7days":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 7);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "last30days":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 30);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "last60days":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 60);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "last90days":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 90);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "alltime":
        default:
          fromDate = "1970-01-01";
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
      }
    }

    static arrayToObj (array) {
      const returnObj = {};
      array && array.length > 0 && array.forEach(item => {
        if (item.indexOf(":") > -1) {
          returnObj[item.substring(0, item.indexOf(":"))] = item.substring(item.indexOf(":") + 1);
        }
      });
      return returnObj;
    }
}
