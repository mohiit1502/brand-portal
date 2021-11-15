/* eslint-disable filenames/match-regex, no-unused-vars, no-unused-expressions, no-undef */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../../../client/reducers";
import LoginTypeCta from "./LoginTypeCta";

describe("Home", () => {
  let component;
  let container;

  beforeEach(() => {
    container = document.createElement("div");
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  it("is LoginTypeCta and renders without error", () => {
    const initialState = {
      checkBox: { checked: false },
      number: { value: 999 }
    };

    const store = createStore(rootReducer, initialState);

    component = ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginTypeCta />
        </BrowserRouter>
      </Provider>,
      container
    );

    expect(component).not.toBe(false);
  });
});
