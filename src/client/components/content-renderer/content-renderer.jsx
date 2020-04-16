import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import CONSTANTS from "../../constants/constants";
import "../../styles/content-renderer/content-page.scss";
import UserProfile from "../user/profile/user-profile";

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
            <div>list</div>
          </Route>
          <Route path={CONSTANTS.ROUTES.USER_MGMT.USER_APPROVAL}>
            <div>approval</div>
          </Route>
        </Switch>
      </div>
    );
  }
}

export  default  connect()(ContentRenderer);
