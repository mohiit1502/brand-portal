/* eslint-disable max-params */
export default class ServerHttpError {

  status;
  error;
  message;
  url;
  email;
  correlationId
  code;

  constructor (status, error, message, url, email, correlationId, code) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.url = url;
    this.email = email;
    this.correlationId = correlationId;
    this.code = code;
  }

}
