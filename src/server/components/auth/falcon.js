import CONSTANTS, {CONSTANTS as VARS} from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import queryString from "query-string";

const secrets = require(VARS.PATH);

class Falcon {

  generateFalconRedirectURL (request, action) {
    try {
      const IAM = request.app.ccmGet("IAM");
      const clientId = secrets.CLIENT_ID;
      const nonce = ServerUtils.randomStringGenerator(secrets.NONCE_STRING_LENGTH).toUpperCase();
      const clientType = secrets.CLIENT_TYPE;
      const state = ServerUtils.randomStringGenerator(secrets.NONCE_STRING_LENGTH).toUpperCase();
      const scope = secrets.SCOPE;
      const responseType = secrets.RESPONSE_TYPE;
      // const isInternal = secrets.IS_INTERNAL;
      const baseUrl = action.toLowerCase() === "login" ? IAM.FALCON_LOGIN_URL : IAM.FALCON_REGISTER_URL;
      // const redirectUri = CONSTANTS.IAM.BASE_URL + IAM.REDIRECT_PATH;
      const redirectUri = IAM.BASE_URL + IAM.REDIRECT_PATH;

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
