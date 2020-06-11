import React from "react";
import PropTypes from "prop-types";
import Demo1 from "./components/temp-delete-later/demo1";
import Demo2 from "./components/temp-delete-later/demo2";
import Modal from "./components/custom-components/modal/custom-modal";
import Authenticator from "./components/authenticator";
import { withRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import {Redirect} from "react-router";
import CONSTANTS from "./constants/constants";
import ClientUtils from "./utility/ClientUtils";
import Notification from "./components/custom-components/notification/notification";

const Root = ({ route, children }) => {
    return (
    <div className="route-wrapper">
      {renderRoutes(route.routes)}
      {children}
      <Modal/>
      <Notification/>
    </div>
  );
};

Root.propTypes = {
  route: PropTypes.object,
  children: PropTypes.object
};

const routes = [
   {
    path: CONSTANTS.ROUTES.ROOT_PATH,
    component: withRouter(Root),
    init: "./init-top",
    routes: [
      {
        path: ClientUtils.getAllValuesFromRecursiveTree(CONSTANTS.ROUTES),
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
