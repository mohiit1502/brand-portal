/* eslint-disable max-params */
export default class ServerHttpError {

  status;
  error;
  message;
  url;
  email;
  correlationId
  code;

  constructor (status, error, message, code, correlationId, url, email) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.code = code;
    this.correlationId = correlationId;
    this.url = url;
    this.email = email;
  }

}
