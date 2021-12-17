/* eslint-disable max-params */
export default class ServerHttpError {

  status;
  error;
  message;
  code;
  correlationId;

  constructor (status, error, message, code, correlationId) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.code = code;
    this.correlationId = correlationId;
  }

}
