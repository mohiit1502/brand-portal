import React from "react";
import { connect } from "react-redux";
import {Route, Switch} from "react-router";
import CONSTANTS from "../../../constants/constants";
import "../../../styles/onboard/content-renderer-onboarding/content-renderer-onboarding.scss";
import ApplicationReview from "./application-review";
import BrandRegistration from "./brand-registration";
import CompanyProfileRegistration from "./company-profile-registration";

class ContentRendererOnboard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loader: false
    };
  }

  render () {
    return (
      <div className={`content-page-onboard row${this.state.loader ? " loader" : ""}`}>
        <div className="col content-page-onboard__col pb-4">
          <Switch>
            <Route path={CONSTANTS.ROUTES.PROTECTED.ONBOARD.COMPANY_REGISTER}>
              <CompanyProfileRegistration {...this.props}/>
            </Route>
            <Route path={CONSTANTS.ROUTES.PROTECTED.ONBOARD.BRAND_REGISTER}>
              <BrandRegistration {...this.props}/>
            </Route>
            <Route path={CONSTANTS.ROUTES.PROTECTED.ONBOARD.APPLICATION_REVIEW}>
              <ApplicationReview {...this.props} setLoader={loader => this.setState({loader})}/>
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export  default  connect()(ContentRendererOnboard);
