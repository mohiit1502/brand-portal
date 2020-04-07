let exp;

if (process.env.NODE_ENV.toLowerCase() === "production") {
  exp = require("./server-constants-prod");
} else {
  exp = require("./server-constants-stg");
}


export default exp;
