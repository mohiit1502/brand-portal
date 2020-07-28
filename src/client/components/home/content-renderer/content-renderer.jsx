import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import CONSTANTS from "../../../constants/constants";
import "../../../styles/home/content-renderer/content-renderer.scss";
import UserProfile from "./user/profile/user-profile";
import UserList from "./user/user-list";
import UserApproval from "./user/user-approval";
import BrandList from "./brand/brand-list";
import ClaimList from "./claim/claim-list";

class ContentRenderer extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="content-page d-inline-block">
        <Switch>
          <Route path={CONSTANTS.ROUTES.PROFILE.USER}>
            <UserProfile {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.USER_MGMT.USER_LIST}>
            <UserList {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.USER_MGMT.USER_APPROVAL}>
            <UserApproval {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.BRANDS.BRANDS_LIST}>
            <BrandList {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.CLAIMS.CLAIMS_LIST}>
            <ClaimList {...this.props}/>
          </Route>
        </Switch>
      </div>
    );
  }
}

export  default  connect()(ContentRenderer);
