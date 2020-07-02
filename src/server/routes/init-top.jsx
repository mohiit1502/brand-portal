import reducer from "../../client/reducers";


export default function initTop() {
  return {
    reducer,
    initialState: {
      // login: {
      //   loginRedirect: falcon.generateFalconRedirectURL()
      // }
    }
  };
}
