import CONSTANTS from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import queryString from "query-string";

class Falcon {

  generateLoginURL(request) {
    try {
      const IAM = request.app.ccmGet("IAM");
      const baseUrl = IAM.FALCON_LOGIN_URL;
      const redirectUri = CONSTANTS.IAM.BASE_URL + IAM.REDIRECT_PATH;
      const clientId = IAM.CLIENT_ID;
      const nonce = ServerUtils.randomStringGenerator(IAM.NONCE_STRING_LENGTH).toUpperCase();
      const clientType = IAM.CLIENT_TYPE;
      const state = ServerUtils.randomStringGenerator(IAM.NONCE_STRING_LENGTH).toUpperCase();
      const scope = IAM.SCOPE;
      const responseType = IAM.RESPONSE_TYPE;
      const isInternal = IAM.IS_INTERNAL;

      return queryString.stringifyUrl({
        url: baseUrl,
        query: {
          redirectUri,
          clientId,
          nonce,
          clientType,
          state,
          scope,
          responseType,
          isInternal
        }}, {encode: false});
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new Falcon();
