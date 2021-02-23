import nj from "node-jose";
import {CONSTANTS} from "../constants/server-constants";
// import ccmLocal from "./../config/ccmFailoverBackup.json";
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

  async ccmGet(request, path) {
    try {
      await request.app.loadCCM();
      return request.app.ccmGet(path);
    } catch (e) {
      console.log("Error at CCM Access: ", e)
      console.log("Triggering failover config access...");
      throw e;
      // return ServerUtils.search(path, ccmLocal);
    }
  }
  // static search(path, obj, selector) {
  //   try {
  //     if (!path) return obj;
  //     const pathArr = path.split(".");
  //     let recurredObject = obj;
  //     let i = 0;
  //     while (i < pathArr.length) {
  //       if (typeof recurredObject === "object" && recurredObject.length !== undefined) {
  //         recurredObject = recurredObject.find(itemInner => itemInner[pathArr[i]] === selector)
  //       } else {
  //         recurredObject = recurredObject[pathArr[i]];
  //       }
  //       i++;
  //     }
  //     return recurredObject;
  //   } catch (e) {
  //     return "";
  //   }
  // }
}
export default new ServerUtils();