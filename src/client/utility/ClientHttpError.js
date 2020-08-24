/* eslint-disable max-params */
export default class ClientHttpError {

  status;
  error;
  message;
  code;

  constructor (status, error, message, code) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.code = code;
  }

}
