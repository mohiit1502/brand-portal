import {CONSTANTS} from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import queryString from "query-string";

const secrets = require(CONSTANTS.PATH);

class Falcon {

  async generateFalconRedirectURL (request, action, clientTypeVar) {
    try {
      const IAM = await ServerUtils.ccmGet(request, "IAM");
      const clientId = secrets.CLIENT_ID;
      const nonce = ServerUtils.randomStringGenerator(secrets.NONCE_STRING_LENGTH).toUpperCase();
      const clientType = clientTypeVar || secrets.CLIENT_TYPE;
      const state = ServerUtils.randomStringGenerator(secrets.NONCE_STRING_LENGTH).toUpperCase();
      const scope = secrets.SCOPE;
      const responseType = secrets.RESPONSE_TYPE;
      const baseUrl = action.toLowerCase() === "login" ? IAM.FALCON_LOGIN_URL : IAM.FALCON_REGISTER_URL;
      const redirectUri = `${process.env.NODE_ENV === "development" ? CONSTANTS.BASE_URL : IAM.BASE_URL}${IAM.REDIRECT_PATH}`;

      return queryString.stringifyUrl({
        url: baseUrl,
        // query: {redirectUri, clientId, nonce, clientType, state, scope, responseType, isInternal}
        query: {redirectUri, clientId, nonce, clientType, state, scope, responseType}
      }, {encode: false});
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new Falcon();
