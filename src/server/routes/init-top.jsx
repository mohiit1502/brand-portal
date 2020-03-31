import reducer from "../../client/reducers";


function generateLoginURL() {
  const baseUrl = "https://retaillink.login.stg.wal-mart.com/authorize?";
  const redirectUri = "http://localhost:3000/brands";
  const clientId = "a0e15a47-ce50-4416-9514-0641afab1fc2";
  const nonce = "generateNoncehere";
  const clientType = "supplier";
  const state = "generateStateHere";
  const scope = "openId";
  const responseType = "code";

  return `${baseUrl}?clientId=${clientId}&redirectUri=${redirectUri}&nonce=${nonce}&clientType=${clientType}&state=${state}&scope=${scope}&responseType=${responseType}`;

}

export default function initTop() {
  return {
    reducer,
    initialState: {
      checkBox: { checked: false },
      number: { value: 979 },
      username: { value: "" },
      textarea: { value: "" },
      selectedOption: { value: "0-13" },
      showFakeComp: { value: true },
      login: {
        loginRedirect: generateLoginURL()
      }
    }
  };
}
