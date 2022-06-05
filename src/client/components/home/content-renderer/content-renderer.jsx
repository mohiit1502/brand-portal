import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import { TOGGLE_ACTIONS , toggleModal} from "../../../actions/modal-actions";
import UserProfile from "./user/profile/user-profile";
import UserList from "./user/user-list";
import BrandList from "./brand/brand-list";
import ClaimList from "./claim/claim-list";
import Help from "../../Help/Help";
import Dashboard from "../../Dashboard";
import CONSTANTS from "../../../constants/constants";
import "../../../styles/home/content-renderer/content-renderer.scss";


class ContentRenderer extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.user && !this.props.user.doItLater && this.props.user.role && this.props.user.role.name == "Super Admin" && this.props.location && this.props.location.pathname == "/dashboard") {
      const {modalsMeta, toggleModal} = this.props;
      toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...modalsMeta.GO_TO_USER_PROFILE});
    }
  }

  render () {
    return (
      <div className="content-page d-inline-block overflow-auto">
        <Switch>
          <Route path={CONSTANTS.ROUTES.PROTECTED.PROFILE.USER}>
            <UserProfile {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.PROTECTED.USER_MGMT.USER_LIST}>
            <UserList {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.PROTECTED.BRANDS.BRANDS_LIST}>
            <BrandList {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.PROTECTED.CLAIMS.CLAIMS_LIST}>
            <ClaimList {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.PROTECTED.CLAIMS.CLAIM_DETAILS}>
            <ClaimList {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.PROTECTED.HELP.HELP}>
            <Help {...this.props}/>
          </Route>
          <Route path={CONSTANTS.ROUTES.PROTECTED.DASHBOARD}>
            <Dashboard {...this.props}/>
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.profile
  };
};

export  default  connect(mapStateToProps)(ContentRenderer);
