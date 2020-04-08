import React from "react";
import PropTypes from "prop-types";
import Demo1 from "./components/demo1";
import Demo2 from "./components/demo2";
import Login from "./components/login/login";
import UserRegistration from "./components/user-registration/user-registration";


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
      {
        path: "/register-user",
        exact: true,
        component: UserRegistration
      },
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
