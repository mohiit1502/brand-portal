export default class Helper {
    getName() {
        const funcNameRegex = /function (.{1,})\(/;
        if (!this) {
            return this;
        }
        const results = (funcNameRegex).exec((this).constructor.toString());
        return (results && results.length > 1) ? results[1] : results;
    }

    static getDateRange(dateKey) {
      let date = new Date();
      const dateInMonth = date.getDate();
      const year = date.getFullYear();
      let month = date.getMonth();
      const day = date.getDay();
      let fromDate, toDate, numberOfDays, quarter;
      switch (dateKey) {
        case "yesterday":
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(dateInMonth - 1);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "lastweek":
          date.setDate(dateInMonth - day);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 7);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "weektodate":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - date.getDay());
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "monthtodate":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(1);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "lastmonth":
          numberOfDays = new Date(year, month, 0).getDate();
          date.setMonth(month - 1);
          date.setDate(numberOfDays);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(1);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "quartertodate":
          quarter = Math.floor(month/3);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setMonth(quarter * 3);
          date.setDate(1);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "lastquarter":
          quarter = Math.floor(month/3);
          let lastQuarter = quarter - 1;
          if (quarter === 0) {
            lastQuarter = 3;
            date.setFullYear(date.getFullYear() - 1);
          }
          date.setMonth(lastQuarter * 3);
          date.setDate(1);
          fromDate = JSON.stringify(date).substring(1, 11);
          date.setMonth(((lastQuarter + 1) * 3) - 1)
          numberOfDays = new Date(date.getFullYear(), (lastQuarter + 1) * 3, 0).getDate();
          date.setDate(numberOfDays);
          toDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "yeartodate":
          date.setDate(dateInMonth + 1);
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(1);
          date.setMonth(0);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "lastyear":
          date.setFullYear(year - 1);
          date.setDate(1);
          date.setMonth(0);
          fromDate = JSON.stringify(date).substring(1, 11);
          date.setDate(31);
          date.setMonth(11);
          toDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "customdate":
          break;
        case "alltime":
        default:
          fromDate = "1970-01-01";
          toDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate}
      }
    }
}
