import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import Immutable from "immutable";
import configureMockStore from 'redux-mock-store';

export const findByTestAttribute = (component,attr) => {
  const wrapper = component.find(`[data-test="${attr}"]`);
  return wrapper;
}

export const testStore = (state) => {

  const mockStore = configureMockStore();
  const store = mockStore(state);
  return store;

}

export const clearKeys = (tree, arr) => {
  if (arr.indexOf(tree) > -1) {
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
