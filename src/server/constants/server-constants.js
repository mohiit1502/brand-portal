export default require("electrode-confippet").config.$("APP_CONFIG");
export const CONSTANTS = {
  STATUS_CODE_SUCCESS: 200,
  STATUS_CODE_NOT_FOUND: 404,
  CORRELATION_ID_LENGTH: 16,
  // PATH: "/Users/m0n02hz/_Projects_/Deliver/Frontend/secrets/secrets.json",
  BASE_URL: "http://localhost:3000",
  PATH: "/secrets/secrets.json",
  TYPES: {
    APPLICATION_JSON: "application/json"
  },
  HEADERS: {
    CONTENT_TYPE_LOWER: "content-type"
  }
};
