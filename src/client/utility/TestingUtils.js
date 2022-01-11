import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import Immutable from "immutable";
import configureMockStore from 'redux-mock-store';
import ClientHttpError from "./ClientHttpError";

export const findByTestAttribute = (component,attr) => component.find(`[data-test="${attr}"]`);

export const testStore = state => configureMockStore()(state);

export const realStore = state => {
  const configureStore = initialState => {
    const composeEnhancers =
      typeof window === "object" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          serialize: { // prettier-ignore
            immutable: Immutable
          }
        }) : compose;
    const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)));

    if (module.hot) {
      module.hot.accept("./reducers", () => {
        const nextRootReducer = require("./reducers").default;
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
  };

  return configureStore(state || window.__WML_REDUX_INITIAL_STATE__);
}

export const clearKeys = (tree, arr) => {
  if (arr && arr.indexOf(tree) > -1) {
    return;
  }
  if (tree && typeof tree === 'object') {
    if (tree.inputId) {
      return;
    }
    arr.push(tree)
    if (tree.key) {
      try {
        delete tree.key;
      } catch (e) {}
    }
    if (Array.isArray(tree)) {
      tree.forEach(obj => clearKeys(obj, arr));
    } else {
      Object.keys(tree).forEach(key => clearKeys(tree[key], arr));
    }
  }
}

export function setupFetchStub(data) {
  return function fetchStub(_url) {
    return new Promise((resolve) => {
      resolve({
        json: () =>
          Promise.resolve({
            data,
          }),
      })
    })
  }
}

export function setupFetchThrowStub() {
  const error = new ClientHttpError(500, "test-error"); // Directly throwing new ClientHttpError fails in Jest
  throw error;
}
