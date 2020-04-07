import React from "react";
import PropTypes from "prop-types";
import Demo1 from "./components/demo1";
import Demo2 from "./components/demo2";
import Login from "./components/login/login";
import LoginRedirect from "./components/login/login-redirect";


import { withRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

const Root = ({ route, children }) => {
  return (
    <div className="route-wrapper">
      {renderRoutes(route.routes)}
      {children}
    </div>
  );
};

Root.propTypes = {
  route: PropTypes.object,
  children: PropTypes.object
};

const routes = [
  {
    path: "/",
    component: withRouter(Root),
    init: "./init-top",
    routes: [
      {
        path: "/",
        exact: true,
        component: Login
      },
      // {
      //   path: "/login-redirect",
      //   exact: true,
      //   component: LoginRedirect
      // },
      {
        path: "/demo1",
        exact: true,
        component: Demo1
      },
      {
        path: "/demo2",
        exact: true,
        component: Demo2
      }
    ]
  }
];

export { routes };
