//
// This is the client side entry point for the React app.
//

import "bootstrap";
import React from "react";
import { render, hydrate } from "react-dom";
import thunk from "redux-thunk";
import Immutable from "immutable";
import { routes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, compose, createStore} from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import { renderRoutes } from "react-router-config";
import { ElectrodeApplication } from "@walmart/electrode-application";
import "node_modules/bootstrap/scss/bootstrap.scss";
import "./styles/global.scss";

// Redux configure store with Hot Module Reload
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

const store = configureStore(window.__WML_REDUX_INITIAL_STATE__);

const start = App => {
  const jsContent = document.querySelector(".js-content");
  const reactStart = window.__WML_REDUX_INITIAL_STATE__ && jsContent.innerHTML ? hydrate : render;

  reactStart(
    <ElectrodeApplication>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ElectrodeApplication>,
    jsContent
  );
};

//
// Hot Module Reload setup
//
if (module.hot) {
  module.hot.accept("./routes", () => {
    const r = require("./routes");
    start(() => renderRoutes(r.routes));
  });
}

start(() => renderRoutes(routes));
