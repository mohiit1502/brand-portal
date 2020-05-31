import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import CONSTANTS from "../../../constants/constants";
import "../../../styles/content-renderer-onboarding/content-renderer-onboarding.scss";
import BrandRegistration from "./brand-registration";
import CompanyProfileRegistration from "./company-profile-registration";

class ContentRendererOnboard extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="content-page-onboard d-inline-block">
        <Switch>
          <Route path={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}>
            <CompanyProfileRegistration />
          </Route>
          <Route path={CONSTANTS.ROUTES.ONBOARD.BRAND_REGISTER}>
            <BrandRegistration />
          </Route>
        </Switch>
      </div>
    );
  }
}

export  default  connect()(ContentRendererOnboard);
