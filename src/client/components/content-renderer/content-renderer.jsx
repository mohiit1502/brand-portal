import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import CONSTANTS from "../../constants/constants";
import "../../styles/content-renderer/content-renderer.scss";
import UserProfile from "./user/profile/user-profile";
import UserList from "./user/user-list";
import UserApproval from "./user/user-approval";

class ContentRenderer extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="content-page d-inline-block">
        <Switch>
          <Route path={CONSTANTS.ROUTES.PROFILE.USER}>
            <UserProfile/>
          </Route>
          <Route path={CONSTANTS.ROUTES.USER_MGMT.USER_LIST}>
            <UserList/>
          </Route>
          <Route path={CONSTANTS.ROUTES.USER_MGMT.USER_APPROVAL}>
            <UserApproval/>
          </Route>
        </Switch>
      </div>
    );
  }
}

export  default  connect()(ContentRenderer);
