import fetch from "node-fetch";
import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import configureMockStore from 'redux-mock-store';
import Immutable from "immutable";
import rootReducer from "../reducers";
import ClientHttpError from "./ClientHttpError";

export const findByTestAttribute = (component,attr) => component.find(`[data-test="${attr}"]`);
jest.mock("node-fetch");
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
    return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)));
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

export function setupFetchStub(data, ok, status, headers) {
  return function fetchStub(_url) {
    return new Promise((resolve) => {
      resolve({
        ok: ok !== undefined ? ok : true,
        json: () => Promise.resolve(data && data.shouldMap ? data[_url] : data),
        text: () => Promise.resolve(data && data.shouldMap ? data[_url] : data),
        status: status || 200,
        headers: headers || Immutable.Map({"content-type": "application/json"})
      })
    })
  }
}

export function setupFetchThrowStub(code) {
  const error = new ClientHttpError(code || 500, "test-error"); // Directly throwing new ClientHttpError fails in Jest
  throw error;
}

export function mockFetch (obj) {
  let fetchMock;
  const fieldDefaults = {data: {}, ok: true, headers: Immutable.Map({"content-type": ["application/json"]}), status: 200};
  const getField = field => obj && obj[field] !== undefined ? obj[field] : fieldDefaults[field];
  fetchMock = setupFetchStub(getField("data"), getField("ok"), getField("status"), getField("headers"));
  fetch.mockImplementation(fetchMock);
}

export function mockFailFetch(code) {
  fetch.mockImplementation(() => setupFetchThrowStub(code));
}

export function clearFetchMock() {
  fetch.mockClear();
}

export async function update (wrapper) {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  wrapper.update();
}
