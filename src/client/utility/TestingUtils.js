import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import Immutable from "immutable";
import configureMockStore from 'redux-mock-store';

export const findByTestAttribute = (component,attr) => {
  const wrapper = component.find(`[data-test="${attr}"]`);
  return wrapper;
}

export const testStore = () => {
  // const configureStore = initialState => {
  //   const composeEnhancers =
  //     typeof window === "object" &&
  //     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  //       window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  //         serialize: { // prettier-ignore
  //           immutable: Immutable
  //         }
  //       }) : compose;
  //   const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)));
  //
  //   if (module.hot) {
  //     module.hot.accept("./reducers", () => {
  //       const nextRootReducer = require("./reducers").default;
  //       store.replaceReducer(nextRootReducer);
  //     });
  //   }
  //
  //   return store;
  // };
  //
  // const store = configureStore(window.__WML_REDUX_INITIAL_STATE__);

  const mockStore = configureMockStore();
  const store = mockStore({});
  return store;

}
