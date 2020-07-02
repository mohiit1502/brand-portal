export default class ServerHttpError {

  status;
  error;
  message;

  constructor (status, error, message) {
    this.status = status;
    this.error = error;
    this.message = message;
  }

}
