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
