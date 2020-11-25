import nj from "node-jose";
import {CONSTANTS} from "../constants/server-constants";
const secrets = require(CONSTANTS.PATH);

class ServerUtils {

  constructor() {

  }

  getHeaders(request) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Consumer_id: "6aa8057e-8795-450a-b349-4ba99b633d2e",
      ROPRO_AUTH_TOKEN: request.state.auth_session_token,
      ROPRO_USER_ID:	request.state.session_token_login_id,
      ROPRO_CLIENT_ID:	"temp-client-id",
      ROPRO_CORRELATION_ID: this.randomStringGenerator(CONSTANTS.CORRELATION_ID_LENGTH)
    };
  }

  randomStringGenerator(len) {
    const random = [];
    const CharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < len; i++) {
      random.push(CharSet.charAt(Math.floor(Math.random() * CharSet.length)));
    }

    return random.join("");
  }

  decryptToken(idToken, idTokenEncryptionKey) {

    const falconSSOTokenKey = JSON.parse(idTokenEncryptionKey);
    const keystore = nj.JWK.createKeyStore();
    let jwtt;
    let obj = null;

    return new Promise((resolve, reject) => {
      try {
        keystore.add(falconSSOTokenKey).then(addedKeyStore => {
          nj.JWE.createDecrypt(addedKeyStore).decrypt(idToken).then(result => {
            const { payload: bufferArray } = result;
            jwtt = String.fromCharCode(...[...bufferArray]);
            const payload = jwtt.split(".")[1];
            const decodedData = Buffer(payload, secrets.ENCODING).toString();
            obj = JSON.parse(decodedData);
            return resolve(obj);
          });
        });
      } catch (err) {
        console.error(`JWT ERROR: ${err}`);
        reject(err);
      }
    });
  }
}

export default new ServerUtils();
