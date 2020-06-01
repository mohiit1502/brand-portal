import ServerHttp from "../../utility/ServerHttp";
import FormData from "form-data";
import FS from "fs";
import Stream from "stream";
import fetch from "node-fetch";

class BrandManagerApi {
  constructor() {
    this.name = "BrandManagerApi";
    this.register = this.register.bind(this);
  }

  register (server) {
    return server.route([]);
  }

}

export default new BrandManagerApi();
