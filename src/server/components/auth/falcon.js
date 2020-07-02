import CONSTANTS from "../../constants/server-constants";
import ServerUtils from "../../utility/server-utils";
import queryString from "query-string";

class Falcon {

  generateFalconRedirectURL(request, action) {
    try {

      let baseUrl;
      const IAM = request.app.ccmGet("IAM");
      const clientId = IAM.CLIENT_ID;
      const nonce = ServerUtils.randomStringGenerator(IAM.NONCE_STRING_LENGTH).toUpperCase();
      const clientType = IAM.CLIENT_TYPE;
      const state = ServerUtils.randomStringGenerator(IAM.NONCE_STRING_LENGTH).toUpperCase();
      const scope = IAM.SCOPE;
      const responseType = IAM.RESPONSE_TYPE;
      const isInternal = IAM.IS_INTERNAL;

      if (action.toLowerCase() === "login") {
        baseUrl = IAM.FALCON_LOGIN_URL;
      } else {
        baseUrl = IAM.FALCON_REGISTER_URL;
      }

      const redirectUri = CONSTANTS.IAM.BASE_URL + IAM.REDIRECT_PATH;

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
