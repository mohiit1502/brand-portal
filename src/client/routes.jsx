import React from "react";
import PropTypes from "prop-types";
import Demo1 from "./components/temp-delete-later/demo1";
import Demo2 from "./components/temp-delete-later/demo2";
import Modal from "./components/modal/custom-modal";
import Authenticator from "./components/authenticator";
import CONSTANTS from "./constants/constants";
import { withRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import {Redirect} from "react-router";

const Root = ({ route, children }) => {
  return (
    <div className="route-wrapper">
      {renderRoutes(route.routes)}
      {children}
      <Modal/>
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
        path: ["/", "/user-management/user-list"],
        exact: true,
        component: Authenticator
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
      },
      {
        path: "/*",
        component: () => <Redirect to="/" />
      }
    ]
  }
];

export { routes };
