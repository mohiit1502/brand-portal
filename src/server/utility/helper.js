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
      let fromDate, toDate;
      switch (dateKey) {
        case "last7days":
          date.setDate(dateInMonth + 1)
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 7);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "last30days":
          date.setDate(dateInMonth + 1)
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 30);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "last60days":
          date.setDate(dateInMonth + 1)
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 60);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "last90days":
          date.setDate(dateInMonth + 1)
          toDate = JSON.stringify(date).substring(1, 11);
          date.setDate(date.getDate() - 90);
          fromDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate};
        case "customdate":
          break;
        case "alltime":
        default:
          fromDate = "1970-01-01";
          date.setDate(dateInMonth + 1)
          toDate = JSON.stringify(date).substring(1, 11);
          return {fromDate, toDate}
      }
    }
}
