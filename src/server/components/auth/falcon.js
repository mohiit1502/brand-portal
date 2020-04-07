import CONSTANTS from "../../constants/server-constants";
import ServerUtils from "../../utility/ServerUtils";
import queryString from "query-string";

class Falcon {

  constructor() {
    this.baseUrl = CONSTANTS.IAM.FALCON_LOGIN_URL;
    this.redirectUri = CONSTANTS.IAM.REDIRECT_URL;
    this.clientId = CONSTANTS.IAM.CLIENT_ID;
    this.nonce = ServerUtils.randomStringGenerator(CONSTANTS.IAM.NONCE_STRING_LENGTH).toUpperCase();
    this.clientType = CONSTANTS.IAM.CLIENT_TYPE;
    this.state = ServerUtils.randomStringGenerator(CONSTANTS.IAM.NONCE_STRING_LENGTH).toUpperCase();
    this.scope = CONSTANTS.IAM.SCOPE;
    this.responseType = CONSTANTS.IAM.RESPONSE_TYPE;
    this.isInternal = CONSTANTS.IAM.IS_INTERNAL;
  }

  generateLoginURL() {
    try {
      return queryString.stringifyUrl({
        url: this.baseUrl,
        query: {
          redirectUri: this.redirectUri,
          clientId: this.clientId,
          nonce: this.nonce,
          clientType: this.clientType,
          state: this.state,
          scope: this.scope,
          responseType: this.responseType,
          isInternal: this.isInternal
        }},{encode : false});
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new Falcon();
