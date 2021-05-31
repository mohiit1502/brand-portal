import React from "react";
import PropTypes from "prop-types";
import Modal from "./components/custom-components/modal/custom-modal";
import Authenticator from "./components/authenticator";
import { withRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import {Redirect} from "react-router";
import CONSTANTS from "./constants/constants";
import ClientUtils from "./utility/ClientUtils";
import Notification from "./components/custom-components/notification/notification";
import {WebformWorkflowDecider} from "./components";

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
    path: CONSTANTS.ROUTES.PROTECTED.ROOT_PATH,
    component: withRouter(Root),
    init: "./init-top",
    routes: [
      {
        path: ClientUtils.getAllValuesFromRecursiveTree(CONSTANTS.ROUTES.PROTECTED),
        exact: true,
        component: Authenticator
      },
      // {
      //   path: CONSTANTS.ROUTES.OPEN.SERVICES,
      //   exact: true,
      //   component: WebformWorkflowDecider
      // },
      {
        path: "/user-management",
        component: () => <Redirect to="/users/user-list" />
      },
      {
        path: "/*",
        component: () => <Redirect to="/" />
      }
    ]
  }
];

export { routes };
