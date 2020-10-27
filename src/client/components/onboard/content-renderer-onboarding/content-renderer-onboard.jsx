import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import CONSTANTS from "../../../constants/constants";
import "../../../styles/onboard/content-renderer-onboarding/content-renderer-onboarding.scss";
import BrandRegistration from "./brand-registration";
import CompanyProfileRegistration from "./company-profile-registration";

class ContentRendererOnboard extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="content-page-onboard row">
        <div className="col content-page-onboard__col">
          <Switch>
            <Route path={CONSTANTS.ROUTES.ONBOARD.COMPANY_REGISTER}>
              <CompanyProfileRegistration {...this.props}/>
            </Route>
            <Route path={CONSTANTS.ROUTES.ONBOARD.BRAND_REGISTER}>
              <BrandRegistration {...this.props}/>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export  default  connect()(ContentRendererOnboard);
